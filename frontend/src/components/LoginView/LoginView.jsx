import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { LOGIN } from "./graphql";
import { setToken } from "../../token";
import { errorToMessages } from "../../utils";

import "./LoginView.css";
import "../common.css";

export default function LoginView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN);

  const submitLogin = async e => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, password } });
      if (data && data.login) {
        setToken(data.login.token);
        const date = moment();
        navigate(`/${date.isoWeekYear()}/${date.isoWeek()}`);
      }
    } catch (ex) {
      setErrors(errorToMessages(ex));
    }
  };

  return (
    <>
      <div className="row justify-content-center">
        <img
          src="title.png"
          alt="Sim-Lab Time Tracker"
          className="login-logo"
        />
      </div>
      <div className="row justify-content-md-center">
        <div className="col-md-8">
          <form onSubmit={submitLogin}>
            <div className="form-group row">
              <label htmlFor="login" className="col-sm-2 col-form-label">
                Логин
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  required
                  className="form-control"
                  id="login"
                  onChange={event => setUsername(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-sm-2 col-form-label">
                Пароль
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  required
                  className="form-control"
                  id="password"
                  onChange={event => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col centered">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-login"
                >
                  Войти
                </button>
              </div>
            </div>
            {errors.length > 0 && (
              <div className="row">
                <div className="col alert alert-danger centered" role="alert">
                  {errors.map(e => (
                    <span key={e}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
