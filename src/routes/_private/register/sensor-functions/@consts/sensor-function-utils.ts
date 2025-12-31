const forbiddenKeywords = [
  'https',
  'http',
  'console.',
  'return',
  'process.',
  'env',
  'require',
  'import',
  'eval',
  'script',
  'alert',
  'document.',
  'window.',
  'localStorage',
  'sessionStorage',
  'cookie',
  'XMLHttpRequest',
  'fetch',
  'prompt',
  'confirm',
  'setTimeout',
  'setInterval',
  'exec',
  'spawn',
  'child_process',
  'global.',
];

export function replacePlaceholdersWithArray(string: string, array: string[]) {
  return string.replace(/\{(\d+)\}/g, (match, index) => {
    const arrayIndex = parseInt(index, 10);
    const replacement = array[arrayIndex] !== undefined ? `{${array[arrayIndex]}}` : match;
    return replacement;
  });
}

export function extractSensorsFromAlgorithm(_algorithm: string) {
  const matches = _algorithm.match(/\{([^}]+)\}/g);

  if (!matches) {
    return { algorithm: _algorithm, sensorsIn: [] };
  }

  const sensorsIn = matches.map((match) => match.slice(1, -1));
  const algorithm = _algorithm.replace(/\{([^}]+)\}/g, (_match, p1) => `{${sensorsIn.indexOf(p1)}}`);

  return { algorithm, sensorsIn };
}

export function validateAlgorithm(text: string) {
  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
  const expressionRegex = /^[\d+\-*/(). ]+$/;

  const errors: string[] = [];

  if (forbiddenKeywords.some((keyword) => text.includes(keyword))) {
    errors.push('Invalid algorithm: Contains forbidden keywords');
  }

  if (ipRegex.test(text)) {
    errors.push('Invalid algorithm');
  }

  if (expressionRegex.test(text)) {
    errors.push("Invalid algorithm: Your algorithm doesn't look like a proper algorithm");
  }

  return errors;
}
