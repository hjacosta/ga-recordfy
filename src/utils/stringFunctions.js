function snakeToCamel(inputString) {
  if (!inputString) {
    return "";
  }
  return inputString.replace(/_([a-z])/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

export { snakeToCamel };
