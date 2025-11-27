/**
 * 从路径中提取语言
 */
export function getLangFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (["it", "en", "es", "fr", "de"].includes(firstSegment)) {
    return firstSegment;
  }
  return "it"; // 默认语言
}

/**
 * 生成带语言的链接
 */
export function withLang(path: string, lang: string): string {
  const langPrefixes = ["/it", "/en", "/es", "/fr", "/de"];
  // 如果路径已经包含语言段，直接返回（兼容 /it 和 /it/... 两种形式）
  if (langPrefixes.some(prefix => path === prefix || path.startsWith(`${prefix}/`))) {
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

