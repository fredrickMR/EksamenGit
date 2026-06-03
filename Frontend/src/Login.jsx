import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  async function AuthLogin(e) {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token",  data.token)
      localStorage.setItem("roles", JSON.stringify(data.roles))
      localStorage.setItem("lastpage", location.pathname)

      const roles = JSON.parse(localStorage.getItem("roles"));

      switch(true)
      {
          case roles.includes("ServiceAdministratorer"):
              navigate("/service")
              break;
          case roles.includes("Mekanikere"):
              navigate("/mekaniker")
              break;
          case roles.includes("Administrators"):
              navigate("/admin")
              break;
          default:
              navigate("/")
              break;
      };
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className='loginpage'>
      <div className='loginplate'>
        <form onSubmit={AuthLogin}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;