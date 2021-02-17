import React from "react";
import { login } from "../conf/routes";
import { Redirect } from "react-router-dom";

const isAuth = window.localStorage.getItem("token") || "";

export default function RequireAuth({ Component }) {
  if (!isAuth) {
    return <Redirect to={login()} />;
  }

  return <Component />;
}
