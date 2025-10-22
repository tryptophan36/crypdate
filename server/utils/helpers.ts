/**
 * Helper: parse initData query-string into object
 */
export function parseInitData(initData: string) {
  const obj: Record<string, string> = {};
  initData.split("&").forEach(pair => {
    const [k, v] = pair.split("=");
    if (k) {
      obj[k] = decodeURIComponent(v || "");
    }
  });
  return obj;
}

