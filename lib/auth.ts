export const getToken = (): string | null => {
  try {
    if (typeof window === "undefined") return null; // SSR 안전성
    const token = localStorage.getItem("token");
    return token ?? null;
  } catch (e) {
    console.error("Failed to access localStorage:", e);
    return null;
  }
};
