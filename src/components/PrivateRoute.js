import React, { useEffect } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function PrivateRoute({ component: Component, ...rest }) {
  const location = useLocation();
  const loginPathName = "/login";
  const signUpPathName = "/signup";
  const forgotPasswordName = "/reset-password";
  const { isVerified, currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return isVerified && currentUser ? (
          location.pathname === loginPathName ||
          location.pathname === signUpPathName ||
          location.pathname === forgotPasswordName ? (
            <Redirect to="/" />
          ) : (
            <Component {...props} />
          )
        ) : location.pathname === loginPathName ||
          location.pathname === signUpPathName ||
          location.pathname === forgotPasswordName ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
