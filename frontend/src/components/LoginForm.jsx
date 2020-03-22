import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { setToken } from "../token";
import { errorToMessages } from "../utils";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const [login, { loading }] = useMutation(gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
      }
    }
  `);

  async function submitLogin(e) {
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
  }

  return (
    <form onSubmit={submitLogin}>
      <p>
        Логин:{" "}
        <input
          type="text"
          onChange={event => setUsername(event.target.value)}
        />
      </p>
      <p>
        Пароль:{" "}
        <input
          type="password"
          onChange={event => setPassword(event.target.value)}
        />
      </p>
      <p>
        <button type="submit" disabled={loading}>
          Войти
        </button>
      </p>
      {errors && errors.map(err => <p key={err}>{err}</p>)}
    </form>
  );
}
