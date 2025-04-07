import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const TutorProtectedRoutes = () => {
  const role = useSelector((state) => state.user.role);

  return role === "tutor" ?  <Outlet /> : <Navigate to="/" replace /> ;
};

export default TutorProtectedRoutes;
