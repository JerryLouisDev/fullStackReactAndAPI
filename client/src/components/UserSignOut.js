import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const UserSignOut = ({ context }) => {
  useEffect(() => context.actions.signOut());

  return <Navigate to="/" />;
};

export default UserSignOut;
