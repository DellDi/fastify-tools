import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch (error) {
    return dateString
  }
}


/**
 * 解析响应头中的 Cookie 字符串
 * @param cookieHeader 响应头中的 cookie 字符串或数组
 * @returns 处理后的 cookie 字符串
 */
export function parseCookies(cookieHeader: string | string[] | null): string {
  if (!cookieHeader) return '';

  // 如果是数组，处理每个 cookie 并合并
  if (Array.isArray(cookieHeader)) {
    return cookieHeader
      .map(cookie => cookie.split(';')[0])
      .join('; ');
  }

  // 如果是字符串，只取第一部分（去掉属性）
  return cookieHeader.split(';')[0];
}