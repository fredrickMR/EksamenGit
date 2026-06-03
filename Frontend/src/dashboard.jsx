import { useState } from 'react';
// import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { jsx } from 'react/jsx-runtime';

function dashboard()
{

    if(!token)
    {
        return (<Navigate to="/" />)
    }

    const parsed = JSON.parse(atob(token.split(".")[1]));

    function logout()
    {
        localStorage.removeItem("token");
        return (<Navigate to="/" />)
    }

    return(
        <div>
            <h1>Dashboard</h1>
            <p>You are logged in as {parsed.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default dashboard;