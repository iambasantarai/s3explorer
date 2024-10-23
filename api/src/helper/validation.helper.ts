export function isValidDirectoryName(name: string): boolean {
  const validNameRegex = /^[^<>:"/\\|?*]+$/;
  return validNameRegex.test(name);
}
