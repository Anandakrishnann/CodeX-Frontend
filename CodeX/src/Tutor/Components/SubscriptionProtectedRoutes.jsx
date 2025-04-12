import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const SubscriptionProtectedRoutes = () => {
    const role = useSelector((state) => state.user.role);
    const subscribed = useSelector((state) => state.user.subscribed);

    return role === "tutor" && !subscribed ?  <Outlet /> : <Navigate to="/" replace /> ;
}

export default SubscriptionProtectedRoutes
