import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const AdminProtected = () => {
  const { role, isAuthenticated } = useSelector((state) => state.user);
    

  return isAuthenticated && role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminProtected;
