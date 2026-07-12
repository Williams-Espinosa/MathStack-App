export function isMathEquivalent(answer: string, expected: string): boolean {
  if (typeof answer !== 'string' || typeof expected !== 'string') {
    return false;
  }

  const normalize = (str: string) => {
    return str
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '') // Remove all whitespaces
      .replace(/,/g, '.'); // Replace commas with dots
  };

  return normalize(answer) === normalize(expected);
}
