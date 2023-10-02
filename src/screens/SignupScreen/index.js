import React from "react";
import "./index.css";
import logo from "../../assets/images/b-logo.png";
import { LoadingModal } from "../../components/LoadingModal";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { signupApi } from "../../api/auth";

function SignupScreen() {
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const signupForm = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
      firstName: "",
      lastName: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      username: Yup.string()
        .email("No es un usuario valido")
        .required("Campo requerido"),
      password: Yup.string().required("Ingrese un contraseña"),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Las contraseñas no coinciden"
      ),
      firstName: Yup.string().required("Campo requerido"),
      lastName: Yup.string().required("Campo requerido"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = {
        username: values.username,
        password: values.password,
        email: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        createdBy: values.username,
        modifiedBy: values.username,
      };

      try {
        setIsLoading(true);
        const user = await signupApi(data);

        console.log(user);
        navigate("/");
        resetForm();
      } catch (error) {
        alert(error.message);
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="login">
      {isLoading && <LoadingModal height="40" width="40" color="#c3c3c3" />}
      <div className="form-container">
        <img className="logo" src={logo} alt="logo" />

        <form className="login-form">
          <label className="form-label required" htmlFor="username">
            Usuario
          </label>
          <input
            placeholder="juanperez@grupoavant.com.do"
            className={
              error
                ? "form-input pass-input form-input--err"
                : "form-input pass-input "
            }
            name="username"
            type="text"
            value={signupForm.values.username}
            onChange={(e) =>
              signupForm.setFieldValue("username", e.target.value)
            }
          />
          {signupForm.errors.username && (
            <span className="input-error-msg">
              {signupForm.errors.username}
            </span>
          )}
          <label className="form-label required" htmlFor="password">
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
            value={signupForm.values.password}
            onChange={(e) =>
              signupForm.setFieldValue("password", e.target.value)
            }
          />
          {signupForm.errors.password && (
            <span className="input-error-msg">
              {" "}
              {signupForm.errors.password}
            </span>
          )}
          <label className="form-label required">Confirme la contraseña</label>
          <input
            className={
              error
                ? "form-input pass-input form-input--err"
                : "form-input pass-input"
            }
            name="passwordConfirmation"
            type="password"
            placeholder="*********"
            value={signupForm.values.passwordConfirmation}
            onChange={(e) =>
              signupForm.setFieldValue("passwordConfirmation", e.target.value)
            }
          />
          {signupForm.errors.passwordConfirmation && (
            <span className="input-error-msg">
              {" "}
              {signupForm.errors.passwordConfirmation}
            </span>
          )}
          <label className="form-label required" htmlFor="firstName">
            Nombre
          </label>
          <input
            className={
              error
                ? "form-input pass-input form-input--err"
                : "form-input pass-input"
            }
            name="firstName"
            type="text"
            placeholder="Ej. Juan"
            value={signupForm.values.firstName}
            onChange={(e) =>
              signupForm.setFieldValue("firstName", e.target.value)
            }
          />
          {signupForm.errors.firstName && (
            <span className="input-error-msg">
              {" "}
              {signupForm.errors.firstName}
            </span>
          )}
          <label className="form-label required" htmlFor="lastName">
            Apellido
          </label>
          <input
            className={
              error
                ? "form-input pass-input form-input--err"
                : "form-input pass-input"
            }
            name="lastName"
            type="text"
            placeholder="Ej. Perez"
            value={signupForm.values.lastName}
            onChange={(e) =>
              signupForm.setFieldValue("lastName", e.target.value)
            }
          />
          {signupForm.errors.lastName && (
            <span className="input-error-msg">
              {" "}
              {signupForm.errors.lastName}
            </span>
          )}
          {error && <span className="error-msg">Usuario inválido</span>}
          <input
            onClick={signupForm.handleSubmit}
            className={"btn login-btn"}
            type="button"
            value="Crear cuenta"
          />
        </form>
        <span className="no-login-label">
          <a href="#" style={{ color: "red" }}>
            No puedo acceder
          </a>{" "}
          | <NavLink to="/">Ya tengo una cuenta</NavLink>
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

export { SignupScreen };
