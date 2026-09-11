import React, { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterProps {
  handleRegister: (password: string, email: string) => void;
}

function Register({ handleRegister }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    handleRegister(password, email);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Regístrate</h2>
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
          Regístrate
        </button>
      </form>
      <div className="auth__signup-container">
        <p className="auth__signup-text">
          ¿Ya eres miembro?{" "}
          <Link to="/signin" className="auth__signup-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
