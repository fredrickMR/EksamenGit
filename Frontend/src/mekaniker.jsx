import { useState } from 'react';
// import { Route, Routes } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { jsx } from 'react/jsx-runtime';


function mekaniker()
{
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!token) {
        return <Navigate to="/" />;
    }

    const parsed = JSON.parse(atob(token.split(".")[1]));

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        navigate("/");
    }

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch("/api/service/getall", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Kunne ikke hente service");

                const data = await res.json();
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Dashboard</h1>
                <div>
                    <span style={{ marginRight: "1rem" }}>Innlogget som: <strong>{parsed.username}</strong></span>
                    <button onClick={logout}>Logg ut</button>
                </div>
            </div>

            <h2>Servicer</h2>

            {loading && <p>Laster...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={th}>Service ID</th>
                            <th style={th}>Bil (Reg.nr)</th>
                            <th style={th}>Mekaniker ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                                    Ingen servicer funnet
                                </td>
                            </tr>
                        ) : (
                            services.map((s) => (
                                <tr key={s.service_id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={td}>{s.service_id}</td>
                                    <td style={td}>{s.bil}</td>
                                    <td style={td}>{s.mekaniker}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const th = {
    padding: "0.75rem 1rem",
    textAlign: "left",
    borderBottom: "2px solid #ccc"
};

const td = {
    padding: "0.75rem 1rem"
};

export default mekaniker;