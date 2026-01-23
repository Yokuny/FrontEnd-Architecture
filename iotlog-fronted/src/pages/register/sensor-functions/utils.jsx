import * as Sentry from "@sentry/react";

const forbiddenKeywords = ["https", "http", "console.", "return", "process.", "env", "require", "import", "eval", "script", "alert", "document.", "window.", "localStorage", "sessionStorage", "cookie", "XMLHttpRequest", "fetch", "prompt", "confirm", "setTimeout", "setInterval", "exec", "spawn", "child_process", "global."];

function replacePlaceholdersWithArray(string, array) {
  return string.replace(/\{(\d+)\}/g, (match, index) => {
    const arrayIndex = parseInt(index, 10);
    const replacement = array[arrayIndex] !== undefined ? `{${array[arrayIndex]}}` : match;
    return replacement;
  });
}

function extractSensorsFromAlgorithm(_algorithm) {
  const matches = _algorithm.match(/\{([^}]+)\}/g);

  if (!matches) {
    return { algorithm: _algorithm, sensorsIn: [] };
  }

  const sensorsIn = matches.map(match => match.slice(1, -1));
  const algorithm = _algorithm.replace(/\{([^}]+)\}/g, (match, p1) => `{${sensorsIn.indexOf(p1)}}`);

  return { algorithm, sensorsIn };
}

function validateAlgorithm(text) {

  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
  const expressionRegex = /^[\d+\-*/(). ]+$/;

  let errors = [];

  if (forbiddenKeywords.some(keyword => text.includes(keyword))) {

    const user = localStorage.getItem("user");
    Sentry.captureMessage(`Forbidden Keyword Sensor Function by user: ${user}`)
    errors.push('Invalid algorithm: Contains forbidden keywords');
  }

  if (ipRegex.test(text)) {

    const user = localStorage.getItem("user");
    Sentry.captureMessage(`IP Address on Sensor Function by user: ${user}`)
    errors.push('Invalid algorithm');

  }

  if (expressionRegex.test(text)) {
    errors.push('Invalid algorithm: Your algorithm doesnt look like a proper algorithm');
    return false;
  }

  return errors;
}

const SensorFunctionUtils = {
  replacePlaceholdersWithArray,
  extractSensorsFromAlgorithm,
  validateAlgorithm
}

export default SensorFunctionUtils;
