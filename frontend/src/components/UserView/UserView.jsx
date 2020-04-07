import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";

import { removeToken } from "../../token";
import { LoadingView } from "../Loading";
import { GET_ME } from "./graphql";

import "./UserView.css";
import "../common.css";

export default function UserView({
  header,
  leftBlock,
  additionalMenuItems,
  children,
}) {
  const { loading, error, data } = useQuery(GET_ME);

  const navigate = useNavigate();
  const apolloClient = useApolloClient();

  if (error) {
    navigate("/login");
    return <LoadingView />;
  }

  if (loading) {
    return <LoadingView />;
  }

  const onLogout = () => {
    removeToken();
    apolloClient.clearStore();
    navigate("/login");
  };

  return (
    <>
      <div className="row align-items-center justify-content-around header">
        <div className="col-lg-3 order-lg-1 col-12 order-3">{leftBlock}</div>
        <div className="col-lg-6 col-12 order-lg-2 order-2">{header}</div>
        <div className="col-lg-3 order-lg-3 col-12 order-1 user-menu">
          <div className="btn-group right-side btn-user-info">
            <button
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {`${data.me.firstName} ${data.me.lastName}`}
            </button>
            <div className="dropdown-menu full-width">
              {data.me.isSuperuser && (
                <>
                  {additionalMenuItems}
                  <a
                    className="dropdown-item"
                    href={process.env.REACT_APP_SERVER_ENDPOINT + "/admin/"}
                  >
                    Админ-панель
                  </a>
                  <div className="dropdown-divider"></div>
                </>
              )}
              <button
                className="dropdown-item"
                type="button"
                onClick={onLogout}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
