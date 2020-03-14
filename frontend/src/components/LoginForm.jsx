import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { setToken } from "../token";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(gql`
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
      console.log(ex);
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
      {error &&
        error.graphQLErrors.map(err => <p key={err.message}>{err.message}</p>)}
    </form>
  );
}
