import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";

const SECTORS_GQL = gql`
  query {
    sectors {
      name
      projects {
        id
        name
        subsystems {
          id
          name
        }
      }
    }
  }
`;

export default function WeekView({ year = 2020, week = 22 }) {
  const { loading, error, data } = useQuery(SECTORS_GQL);

  const navigate = useNavigate();

  console.log(loading);
  console.log(error);
  console.log(data);

  if (error) {
    navigate("/login");
  }

  return (
    <>
      <h1>
        Week view ({year}/{week})
      </h1>
      {data && data.sectors.map(s => <p key={s.name}>{s.name}</p>)}
    </>
  );
}
