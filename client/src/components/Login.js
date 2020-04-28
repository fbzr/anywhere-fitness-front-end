// REACT I only
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Styles } from "./Styles";
import { axiosWithAuth } from "../utils/axiosWithAuth";

import * as yup from "yup";

const initialLoginValues = {
  username: "",
  password: "",
  instructorOrClient: "",
};

const initialLoginErrors = {
  username: "",
  password: "",
  instructorOrClient: "",
};

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, "Username must be at least 4 characters.")
    .required("Username is required to login."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .required("Please enter your password."),
  instructorOrClient: yup
    .string()
    .matches(/(instructor|client)/, "Either instructor or client.")
    .required("Please select instructor or client."),
});

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loginValues, setLoginValues] = useState(initialLoginValues);
  const [loginErrors, setLoginErrors] = useState(initialLoginErrors);

  const [formDisabled, setFormDisabled] = useState(true);

  const onInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    yup
      .reach(loginSchema, name)
      .validate(value)
      .then((valid) => {
        setLoginErrors({
          ...loginErrors,
          [name]: "",
        });
      })
      .catch((err) => {
        setLoginErrors({
          ...loginErrors,
          [name]: err.errors[0],
        });
      });

    setLoginValues({
      ...loginValues,
      [name]: value,
    });
  };

  useEffect(() => {
    loginSchema.isValid(loginValues).then((valid) => {
      setFormDisabled(!valid);
    });
  }, [loginValues]);

  // POST / api / auth / instructors / login
  // POST / api / auth / clients / login

  // omar12 omar12 instructor
  // omarr omarrr client
  const onSubmit = (e) => {
    e.preventDefault();
    if (loginValues.instructorOrClient === "instructor") {
      axiosWithAuth()
        .post("/api/auth/instructors/login", loginValues)
        .then((res) => {
          console.log(res);
          dispatch({ type: "SAVE_USER_ID", payload: res.data.id });
          localStorage.setItem("token", JSON.stringify(res.data.token));
          history.push("/account/instructor");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosWithAuth()
        .post("/api/auth/clients/login", loginValues)
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data.token));
          history.push("/account/client");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //  const loginUser = {
    //    username: e.target.username,
    //    password: e.target.password,
    //  };
  };

  return (
    <Styles>
      <form>
        <h1>Login</h1>

        <label>
          Username:&nbsp;
          <input
            onChange={onInputChange}
            name="username"
            type="username"
            errors={loginErrors}
          />
        </label>
        <div className="errors">{loginErrors.username}</div>

        <label>
          Password:&nbsp;
          <input
            onChange={onInputChange}
            name="password"
            type="password"
            errors={loginErrors}
          />
        </label>
        <div className="errors">{loginErrors.password}</div>

        <label>
          Instructor or Client:&nbsp;
          <select onChange={onInputChange} name="instructorOrClient">
            <option defaultValue="">Please Choose</option>
            <option value="instructor">Instructor</option>
            <option value="client">Client</option>
          </select>
        </label>
        <div className="errors">{loginErrors.instructorOrClient}</div>

        <button onClick={onSubmit} disabled={formDisabled}>
          Login
        </button>

        <h5>
          Need to register? <Link to="/signup">Sign up here.</Link>
        </h5>
      </form>
    </Styles>
  );
}

export default Login;
