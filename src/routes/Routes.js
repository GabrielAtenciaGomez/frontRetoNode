import React from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import { login, carros } from "../conf/routes";
import RequireAuth from "../helpers/RequireAuth";
import Login from "../pages/Login";
import Carros from "../pages/Carros";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={login()} component={Login}></Route>
        <Route
          exact
          path={carros()}
          component={(props) => <RequireAuth {...props} Component={Carros} />}
        ></Route>
        <Redirect path="/*" to={login()}></Redirect>
      </Switch>
    </BrowserRouter>
  );
}
