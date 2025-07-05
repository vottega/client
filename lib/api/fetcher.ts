import { getToken } from "@/lib/auth";
import { HttpError } from "./errors";

export async function customFetch<T = any>(input: RequestInfo, options?: RequestInit): Promise<T> {
  const token = getToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    cache: "no-store", // 서버에서 fresh fetch
  };

  try {
    const res = await fetch(input, config);

    if (!res.ok) {
      const errorBody = await res.text();
      throw new HttpError(res.status, res.statusText, errorBody);
    }

    const contentType = res.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      return res.json() as Promise<T>;
    }

    return res.text() as unknown as T; // 텍스트 등 다른 형식 응답
  } catch (err) {
    if (err instanceof HttpError) {
      console.error(`[HTTP Error ${err.statusCode}]`, err.message);
    } else {
      console.error("[fetch error]", err);
    }
    throw err;
  }
}
