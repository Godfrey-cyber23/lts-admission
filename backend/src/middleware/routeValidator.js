export const validateRoutePath = (path) => {
  if (typeof path !== 'string') {
    throw new Error(`Route path must be a string, got ${typeof path}`);
  }

  // Check for invalid starting characters
  const invalidStartChars = ['?', '*', '+', ':'];
  if (invalidStartChars.some(char => path.startsWith(char))) {
    throw new Error(`Route path cannot start with modifier character: ${path}`);
  }

  // Check parameter syntax
  if (path.includes(':')) {
    const paramParts = path.split(':').slice(1);
    paramParts.forEach(part => {
      const paramName = part.split('/')[0].split('?')[0];
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(paramName)) {
        throw new Error(`Invalid parameter name in path: ${path}`);
      }
    });
  }

  return true;
};