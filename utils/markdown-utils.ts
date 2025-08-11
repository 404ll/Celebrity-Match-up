/**
 * 清理Markdown格式的JSON内容
 */
export function cleanMarkdownJson(content: string): string {
  let cleanContent = content
    .replace(/```json\s*/g, '')
    .replace(/```\s*$/g, '')
    .trim();

  // 如果内容仍然包含 Markdown 格式，尝试提取 JSON 对象
  if (cleanContent.includes('{') && cleanContent.includes('}')) {
    const jsonStart = cleanContent.indexOf('{');
    const jsonEnd = cleanContent.lastIndexOf('}') + 1;
    cleanContent = cleanContent.substring(jsonStart, jsonEnd);
  }

  return cleanContent.trim();
}

/**
 * 从Markdown内容中提取JSON对象
 */
export function extractJsonFromMarkdown(content: string): string {
  let cleanContent = cleanMarkdownJson(content);

  // 如果内容仍然包含 Markdown 格式，尝试提取 JSON 对象
  if (cleanContent.includes('{') && cleanContent.includes('}')) {
    const jsonStart = cleanContent.indexOf('{');
    const jsonEnd = cleanContent.lastIndexOf('}') + 1;
    cleanContent = cleanContent.substring(jsonStart, jsonEnd);
  }

  return cleanContent.trim();
}
