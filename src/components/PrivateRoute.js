import React from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
export default function PrivateRoute({ component: Component, ...rest }) {
  const location = useLocation();
  const loginPathName = "/login";
  const logged = true;
  return (
    <Route
      {...rest}
      render={(props) => {
        return logged ? (
          location.pathname === loginPathName ? (
            <Redirect to="/" />
          ) : (
            <Component {...props} />
          )
        ) : location.pathname === loginPathName ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
