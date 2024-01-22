import React from "react";
import "./index.css";
import logo from "../../assets/images/b-logo.png";
import { LoadingModal } from "../../components/LoadingModal";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import * as Yup from "yup";
import { loginApi } from "../../api/auth";

function LoginScreen() {
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { login } = React.useContext(AuthContext);

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      username: Yup.string().email("No es un usuario valido").required(""),
      password: Yup.string().required("Ingrese un contraseña"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const { username, password } = values;
      try {
        setIsLoading(true);
        const userData = await loginApi({ username, password });
        login(userData.body);
        resetForm();
      } catch (error) {
        setError(error.message);
        // alert(error.message);
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="login">
      {isLoading && <LoadingModal height="40" width="40" color="#c3c3c3" />}
      <div className="form-container">
        <img className="logo" width={20} src={logo} alt="logo" />
        <h2 style={{ textAlign: "center" }}>Acceder</h2>
        <form className="login-form">
          <label className="form-label">Usuario</label>
          <input
            className={
              error
                ? "form-input pass-input form-input--err"
                : "form-input pass-input"
            }
            name="username"
            type="text"
            value={loginForm.values.username}
            onChange={(e) =>
              loginForm.setFieldValue("username", e.target.value)
            }
          />
          {loginForm.errors.username && (
            <span className="input-error-msg">{loginForm.errors.username}</span>
          )}
          <label className="form-label">Contraseña</label>
          <input
            className={
              error
                ? "form-input pass-input form-input--err"
                : "form-input pass-input"
            }
            name="password"
            type="password"
            placeholder="*********"
            value={loginForm.values.password}
            onChange={(e) =>
              loginForm.setFieldValue("password", e.target.value)
            }
          />
          {loginForm.errors.password && (
            <span className="input-error-msg">
              {" "}
              {loginForm.errors.password}
            </span>
          )}
          {error && <span className="error-msg">{error}</span>}
          <input
            onClick={loginForm.handleSubmit}
            className={"btn login-btn"}
            type="button"
            value="Acceder"
          />
        </form>
        <span className="no-login-label">
          <a href="#" style={{ color: "red" }}>
            No puedo acceder
          </a>{" "}
          | <NavLink to="/signup">Crear una cuenta</NavLink>
        </span>
        <div className="lan-list-container">
          <select className="lan-list">
            <option value="spanish">Español</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export { LoginScreen };
