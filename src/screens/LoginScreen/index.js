import React from "react";
import "./index.css";
import logo from "../../assets/images/b-logo.png";
import { LoadingModal } from "../../components/LoadingModal";
import { useFormik } from "formik";
import * as Yup from "yup";

function LoginScreen() {
  const [error, setError] = React.useState(false);

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
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      resetForm();
    },
  });

  return (
    <div className="login">
      {error && <LoadingModal height="40" width="40" color="#c3c3c3" />}
      <div className="form-container">
        <img className="logo" src={logo} alt="logo" />

        <form className="login-form">
          <label className="form-label" htmlFor="username">
            Usuario
          </label>
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
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
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
          {error && <span className="error-msg">Usuario inválido</span>}
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
          | <a href="#">Crear una cuenta</a>
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
