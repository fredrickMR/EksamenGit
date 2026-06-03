import { useState } from 'react';
// import { Route, Routes } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { jsx } from 'react/jsx-runtime';


function mekaniker()
{
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");
    const navigate = useNavigate();

    if(!token)
    {
        return (<Navigate to="/" />)
    }

    function logout()
    {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        navigate("/");
    }

    const parsed = JSON.parse(atob(token.split(".")[1]));

    return(
        <div>
            <h1>Dashboard</h1>
            <p>You are logged in as {parsed.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default mekaniker;