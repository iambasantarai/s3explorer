export function isValidDirectoryName(name: string): boolean {
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  return validNameRegex.test(name);
}
