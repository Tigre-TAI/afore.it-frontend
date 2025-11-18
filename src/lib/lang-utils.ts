/**
 * 从路径中提取语言
 */
export function getLangFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (["it", "en", "es"].includes(firstSegment)) {
    return firstSegment;
  }
  return "it"; // 默认语言
}

/**
 * 生成带语言的链接
 */
export function withLang(path: string, lang: string): string {
  // 如果路径已经包含语言段，直接返回
  if (path.startsWith("/it/") || path.startsWith("/en/") || path.startsWith("/es/")) {
    return path;
  }
  // 如果路径是根路径，返回语言根路径
  if (path === "/") {
    return `/${lang}`;
  }
  // 添加语言前缀
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${cleanPath}`;
}

