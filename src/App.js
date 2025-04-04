import React, { useState, useEffect } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (token) getBalance();
  }, [token]);

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      toast.success("Autentificat cu succes!");
    } catch {
      toast.error("Eroare la autentificare!");
    }
  };

  const register = async () => {
    try {
      await axios.post("http://localhost:3000/register", {
        name,
        phone,
        email,
        address,
        password,
      });
      toast.success("Înregistrare reușită!");
      setIsRegister(false);
    } catch {
      toast.error("Eroare la înregistrare!");
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    toast.info("Te-ai deconectat cu succes!");
  };

  const getBalance = async () => {
    try {
      const userId = parseInt(token.split(" ")[1]);
      const res = await axios.get(`http://localhost:3000/balance/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
    } catch {
      toast.error("Eroare la obținerea soldului!");
    }
  };

  const transfer = async () => {
    try {
      const userId = parseInt(token.split(" ")[1]);
      await axios.post("http://localhost:3000/transfer", {
        fromId: userId,
        toId: parseInt(toId),
        amount: parseInt(amount),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Transfer reușit!");
      getBalance();
    } catch {
      toast.error("Eroare la transfer!");
    }
  };

  return (
    <div className="container">
      <h1>Moneta Banking</h1>

      <ToastContainer position="bottom-center" />

      {!token && (
        <>
          <div className="toggle-container">
            <span>LOG IN</span>
            <input
              type="checkbox"
              id="reg-log"
              checked={isRegister}
              onChange={() => setIsRegister(!isRegister)}
            />
            <label htmlFor="reg-log" className="switch"></label>
            <span>SIGN UP</span>
          </div>

          <div className="card-3d-wrap">
          <div className={`card-3d-wrapper ${isRegister ? "rotate" : ""}`}>
              <div className="card-front">
                <h3>Log In</h3>
                <div className="form-group">
                  <i className="uil uil-at input-icon"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-style"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <i className="uil uil-lock input-icon"></i>
                  <input
                    type="password"
                    placeholder="Parola"
                    className="form-style"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button className="btn" onClick={login}>Login</button>
              </div>

              <div className="card-back">
                <h3>Sign Up</h3>
                <div className="form-group">
                  <i className="uil uil-user input-icon"></i>
                  <input
                    type="text"
                    placeholder="Nume complet"
                    className="form-style"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <i className="uil uil-at input-icon"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-style"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <i className="uil uil-lock input-icon"></i>
                  <input
                    type="password"
                    placeholder="Parola"
                    className="form-style"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <i className="uil uil-phone input-icon"></i>
                  <input
                    type="text"
                    placeholder="Telefon"
                    className="form-style"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <i className="uil uil-map-marker input-icon"></i>
                  <input
                    type="text"
                    placeholder="Adresa"
                    className="form-style"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <button className="btn" onClick={register}>Register</button>
              </div>
            </div>
          </div>
        </>
      )}

      {token && (
        <div className="card">
          <h3>Sold curent</h3>
          <h4>{balance !== null ? `${balance} RON` : "..."}</h4>
          <input
            type="number"
            className="form-input"
            placeholder="ID Destinatar"
            value={toId}
            onChange={(e) => setToId(e.target.value)}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Sumă de transfer"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn" onClick={transfer}>Transfer</button>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
