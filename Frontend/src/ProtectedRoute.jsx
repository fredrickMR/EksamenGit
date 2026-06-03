import { Navigate, useLocation } from 'react-router-dom'


function ProtectedRoute({ children, allowedrole }) {
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("roles"));
    const location = useLocation();

    if(!token)
    {
        return (<Navigate to="/" />)
    }

    if(roles.includes("Admin"))
    {
        return children;
    }

    if(!roles.includes(allowedrole))
    {
        const page = localStorage.getItem("lastpage") || "/";
        return (<Navigate to={page} />)
    }

  return children
}

export default ProtectedRoute;