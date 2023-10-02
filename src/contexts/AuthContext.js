import React from "react";

export const AuthContext = React.createContext({
  auth: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider(props) {
  const { children } = props;

  const [token, setToken] = React.useState(
    JSON.parse(sessionStorage.getItem("session"))?.token
  );

  const login = (userData) => {
    sessionStorage.setItem("session", JSON.stringify(userData));
    setToken(userData.token);
  };

  const logout = () => {
    sessionStorage.removeItem("session");
    setToken("");
  };

  const auth = (() => {
    return JSON.parse(sessionStorage.getItem("session"));
  })();

  const valueContext = {
    auth,
    login,
    logout,
    token,
  };

  return (
    <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
  );
}
