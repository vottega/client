import { fetchEventSource } from "@microsoft/fetch-event-source";

export class SSEManager {
  private abortController: AbortController | null = null;
  private reconnectTimer: number | null = null;
  private isClosed = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5; // 최대 재연결 시도 횟수 제한

  public subscribe(
    url: string,
    onMessage: (data: any) => void,
    token: string,
    onOpen?: () => void,
    onError?: (error: any) => void,
    reconnectInterval: number = 15000, // 15초로 증가
  ) {
    this.isClosed = false;
    this.reconnectAttempts = 0; // 새로운 연결 시 재시도 횟수 초기화
    this.connect(url, onMessage, token, onOpen, onError, reconnectInterval);

    // 정리 함수 반환
    return () => {
      this.close();
    };
  }

  private async connect(
    url: string,
    onMessage: (data: any) => void,
    token: string,
    onOpen?: () => void,
    onError?: (error: any) => void,
    reconnectInterval: number = 15000,
  ) {
    if (this.isClosed) return;

    // 이전 연결 정리
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    try {
      await fetchEventSource(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
        signal: this.abortController.signal,

        onopen: async (response) => {
          if (response.ok && response.headers.get("content-type")?.includes("text/event-stream")) {
            console.log("[SSE] Connected to", url);
            this.reconnectAttempts = 0; // 연결 성공시 재시도 횟수 리셋
            onOpen?.();
            return;
          } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            // Client-side errors are usually non-retriable
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          } else {
            // Server errors or other issues - will retry
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        },

        onmessage: (event) => {
          try {
            const parsed = JSON.parse(event.data);
            onMessage(parsed);
          } catch (e) {
            console.error("[SSE parse error]", e);
          }
        },

        onclose: () => {
          if (!this.isClosed) {
            console.log("[SSE] Connection closed by server");
            this.scheduleReconnect(url, onMessage, token, onOpen, onError, reconnectInterval);
          }
        },

        onerror: (err) => {
          console.error("[SSE error]", err);
          onError?.(err);

          if (!this.isClosed) {
            this.scheduleReconnect(url, onMessage, token, onOpen, onError, reconnectInterval);
          }
        },
      });
    } catch (error) {
      if (!this.isClosed) {
        console.error("[SSE connection error]", error);
        onError?.(error);
        this.scheduleReconnect(url, onMessage, token, onOpen, onError, reconnectInterval);
      }
    }
  }

  private scheduleReconnect(
    url: string,
    onMessage: (data: any) => void,
    token: string,
    onOpen?: () => void,
    onError?: (error: any) => void,
    reconnectInterval: number = 15000,
  ) {
    if (this.isClosed || this.reconnectTimer) return;

    // 최대 재시도 횟수 체크
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(
        `[SSE] Maximum reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`,
      );
      onError?.(new Error("Maximum reconnection attempts reached"));
      this.close();
      return;
    }

    this.reconnectAttempts++;
    // 지수적 백오프 적용 (최대 60초까지)
    const backoffInterval = Math.min(
      reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1),
      60000,
    );

    console.log(
      `[SSE] Reconnecting in ${backoffInterval}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(url, onMessage, token, onOpen, onError, reconnectInterval);
    }, backoffInterval);
  }

  public close() {
    this.isClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    console.log("[SSE] Connection closed");
  }
}

// 싱글톤 패턴으로 SSEManager 인스턴스 재사용
const sseManagerInstances = new Map<string, SSEManager>();

// 기존 API와 호환성을 위한 wrapper 함수
export const subscribeToSSE = (
  url: string,
  onMessage: (data: any) => void,
  token: string,
  onOpen?: () => void,
  onError?: (error: any) => void,
  reconnectInterval: number = 15000,
) => {
  // URL + token 조합으로 고유 키 생성
  const key = `${url}:${token}`;

  // 기존 매니저가 있다면 종료
  if (sseManagerInstances.has(key)) {
    const existingManager = sseManagerInstances.get(key)!;
    existingManager.close(); // 기존 연결 종료
    sseManagerInstances.delete(key);
  }

  // 새 매니저 생성 및 저장
  const manager = new SSEManager();
  sseManagerInstances.set(key, manager);

  const unsubscribe = manager.subscribe(url, onMessage, token, onOpen, onError, reconnectInterval);

  return () => {
    unsubscribe();
    sseManagerInstances.delete(key);
  };
};
