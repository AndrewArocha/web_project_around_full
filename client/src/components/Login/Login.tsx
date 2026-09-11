import React, { useState } from "react";
import { Link } from "react-router-dom";

interface LoginProps {
  handleLogin: (password: string, email: string) => void;
}

function Login({ handleLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    handleLogin(password, email);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Inicia sesión</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth__input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <button className="auth__submit-button" type="submit">
          Inicia sesión
        </button>
      </form>
      <div className="auth__signup-container">
        <p className="auth__signup-text">
          ¿Aún no eres miembro?{" "}
          <Link to="/signup" className="auth__signup-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
