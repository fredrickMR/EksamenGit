import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function service() {
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [kundeId, setKundeId] = useState("");
    const [kundeNavn, setKundeNavn] = useState("");
    const [kundeResult, setKundeResult] = useState([]);

    const [bilReg, setBilReg] = useState("");
    const [bilModell, setBilModell] = useState("");
    const [bilEier, setBilEier] = useState("");
    const [bilResult, setBilResult] = useState([]);

    const [serviceId, setServiceId] = useState("");
    const [serviceBil, setServiceBil] = useState("");
    const [serviceMekaniker, setServiceMekaniker] = useState("");
    const [serviceResult, setServiceResult] = useState([]);

    if (!token || roles !== "ServiceAdministratorer") {
        return <Navigate to="/" />;
    }

    const parsed = JSON.parse(atob(token.split(".")[1]));

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        navigate("/");
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        GetKunder();
        GetBiler();
        GetServices();
    }, []);

    async function GetKunder() {
        try {
            setError("");
            const res = await fetch('/api/kunde/getall', { headers });
            setKundeResult(await res.json());
            setKundeId(""); setKundeNavn("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function GetKunde() {
        try {
            setError("");
            const res = await fetch(`/api/kunde/get/${kundeId}`, { headers });
            setKundeResult(await res.json());
            setKundeId(""); setKundeNavn("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function CreateKunde() {
        try {
            setError("");
            const res = await fetch('/api/kunde/post', {
                method: 'POST', headers,
                body: JSON.stringify({ navn: kundeNavn })
            });
            setKundeResult(await res.json());
            setKundeId(""); setKundeNavn("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function PutKunde() {
        try {
            setError("");
            const res = await fetch(`/api/kunde/put/${kundeId}`, {
                method: 'PUT', headers,
                body: JSON.stringify({ navn: kundeNavn })
            });
            setKundeResult(await res.json());
            setKundeId(""); setKundeNavn("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function DeleteKunde(id) {
        try {
            setError("");
            const res = await fetch(`/api/kunde/delete/${id}`, { method: 'DELETE', headers });
            setKundeResult(await res.json());
            setKundeId(""); setKundeNavn("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function GetBiler() {
        try {
            setError("");
            const res = await fetch('/api/bil/getall', { headers });
            setBilResult(await res.json());
            setBilReg(""); setBilModell(""); setBilEier("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function GetBil() {
        try {
            setError("");
            const res = await fetch(`/api/bil/get/${bilReg}`, { headers });
            setBilResult(await res.json());
            setBilReg(""); setBilModell(""); setBilEier("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function CreateBil() {
        try {
            setError("");
            const res = await fetch('/api/bil/post', {
                method: 'POST', headers,
                body: JSON.stringify({ bil_registreringsnummer: bilReg, modell_navn: bilModell, eier_id: bilEier })
            });
            setBilResult(await res.json());
            setBilReg(""); setBilModell(""); setBilEier("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function PutBil() {
        try {
            setError("");
            const res = await fetch(`/api/bil/put/${bilReg}`, {
                method: 'PUT', headers,
                body: JSON.stringify({ modell_navn: bilModell, eier_id: bilEier })
            });
            setBilResult(await res.json());
            setBilReg(""); setBilModell(""); setBilEier("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function DeleteBil(reg) {
        try {
            setError("");
            const res = await fetch(`/api/bil/delete/${reg}`, { method: 'DELETE', headers });
            setBilResult(await res.json());
            setBilReg(""); setBilModell(""); setBilEier("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function GetServices() {
        try {
            setError("");
            const res = await fetch('/api/service/getall', { headers });
            setServiceResult(await res.json());
            setServiceId(""); setServiceBil(""); setServiceMekaniker("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function GetService() {
        try {
            setError("");
            const res = await fetch(`/api/service/get/${serviceId}`, { headers });
            setServiceResult(await res.json());
            setServiceId(""); setServiceBil(""); setServiceMekaniker("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function CreateService() {
        try {
            setError("");
            const res = await fetch('/api/service/post', {
                method: 'POST', headers,
                body: JSON.stringify({ bil: serviceBil, mekaniker: serviceMekaniker })
            });
            setServiceResult(await res.json());
            setServiceId(""); setServiceBil(""); setServiceMekaniker("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function PutService() {
        try {
            setError("");
            const res = await fetch(`/api/service/put/${serviceId}`, {
                method: 'PUT', headers,
                body: JSON.stringify({ bil: serviceBil, mekaniker: serviceMekaniker })
            });
            setServiceResult(await res.json());
            setServiceId(""); setServiceBil(""); setServiceMekaniker("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    async function DeleteService(id) {
        try {
            setError("");
            const res = await fetch(`/api/service/delete/${id}`, { method: 'DELETE', headers });
            setServiceResult(await res.json());
            setServiceId(""); setServiceBil(""); setServiceMekaniker("");
        } catch (e) { console.error(e); setError(e.message); }
    }

    const kundeItems = Array.isArray(kundeResult) ? kundeResult : kundeResult ? [kundeResult] : [];
    const bilItems = Array.isArray(bilResult) ? bilResult : bilResult ? [bilResult] : [];
    const serviceItems = Array.isArray(serviceResult) ? serviceResult : serviceResult ? [serviceResult] : [];

    return (
        <main>
            <div>
                <h1>Dashboard</h1>
                <p>You are logged in as {parsed.username}</p>
                <button onClick={logout}>Logout</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Kunder */}
            <section>
                <h2>Kunder</h2>
                <div>
                    <input type="number" placeholder="kunde_id" value={kundeId} onChange={e => setKundeId(e.target.value)} />
                    <input type="text" placeholder="navn" value={kundeNavn} onChange={e => setKundeNavn(e.target.value)} />
                </div>
                <div>
                    <button onClick={GetKunde}>Get</button>
                    <button onClick={GetKunder}>GetAll</button>
                    <button onClick={CreateKunde}>Post</button>
                    <button onClick={PutKunde}>Put</button>
                    <button onClick={() => DeleteKunde(kundeId)}>Delete</button>
                </div>
                <div>
                    {kundeItems.map(k => (
                        <div key={k.kunde_id}>
                            <p>Id: {k.kunde_id}</p>
                            <p>Navn: {k.navn}</p>
                            <button onClick={() => DeleteKunde(k.kunde_id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Biler */}
            <section>
                <h2>Biler</h2>
                <div>
                    <input type="text" placeholder="registreringsnummer" value={bilReg} onChange={e => setBilReg(e.target.value)} />
                    <input type="text" placeholder="modell_navn" value={bilModell} onChange={e => setBilModell(e.target.value)} />
                    <input type="number" placeholder="eier_id (kunde)" value={bilEier} onChange={e => setBilEier(e.target.value)} />
                </div>
                <div>
                    <button onClick={GetBil}>Get</button>
                    <button onClick={GetBiler}>GetAll</button>
                    <button onClick={CreateBil}>Post</button>
                    <button onClick={PutBil}>Put</button>
                    <button onClick={() => DeleteBil(bilReg)}>Delete</button>
                </div>
                <div>
                    {bilItems.map(b => (
                        <div key={b.bil_registreringsnummer}>
                            <p>Reg.nr: {b.bil_registreringsnummer}</p>
                            <p>Modell: {b.modell_navn}</p>
                            <p>Eier ID: {b.eier_id}</p>
                            <button onClick={() => DeleteBil(b.bil_registreringsnummer)}>Delete</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Service */}
            <section>
                <h2>Service</h2>
                <div>
                    <input type="number" placeholder="service_id" value={serviceId} onChange={e => setServiceId(e.target.value)} />
                    <input type="text" placeholder="bil (reg.nr)" value={serviceBil} onChange={e => setServiceBil(e.target.value)} />
                    <input type="number" placeholder="mekaniker_id" value={serviceMekaniker} onChange={e => setServiceMekaniker(e.target.value)} />
                </div>
                <div>
                    <button onClick={GetService}>Get</button>
                    <button onClick={GetServices}>GetAll</button>
                    <button onClick={CreateService}>Post</button>
                    <button onClick={PutService}>Put</button>
                    <button onClick={() => DeleteService(serviceId)}>Delete</button>
                </div>
                <div>
                    {serviceItems.map(s => (
                        <div key={s.service_id}>
                            <p>Service ID: {s.service_id}</p>
                            <p>Bil: {s.bil}</p>
                            <p>Mekaniker ID: {s.mekaniker}</p>
                            <button onClick={() => DeleteService(s.service_id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default service;
