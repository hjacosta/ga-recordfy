function errorHandler(error) {
  error = error.message;
  let res = { msg: "", action: () => {} };

  console.log(error.includes("jwt"));

  if (error.includes("jwt")) {
    res.msg = "Tu sesión ha expirado!";
    res.action = () => {};
  }

  return res;
}

export { errorHandler };
