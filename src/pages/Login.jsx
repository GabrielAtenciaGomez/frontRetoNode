import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import Ico from "../assets/img/icoCar.png";
import peticiones from "../helpers/Peticiones.helper";
import { carros } from "../conf/routes";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");

  const sudmidHandled = async (e) => {
    e.preventDefault();
    const resultado = await peticiones.login(usuario, pass);
    if (resultado) {
      window.location.href = carros();
    } else {
      alert("user o password incorrect");
    }
  };

  useEffect(() => {
    const fun = async function fetchData() {
      const resultado = await peticiones.isLoged();
      if (resultado === true) {
        window.location.href = carros();
      }
    };
    fun();
  }, []);
  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <div className="fadeIn first">
          <img src={Ico} id="icon" alt="User Icon" />
        </div>

        <form onSubmit={sudmidHandled}>
          <input
            type="text"
            id="login"
            className="fadeIn second"
            name="usuario"
            placeholder="usuario"
            autoComplete="off"
            value={usuario}
            required
            onChange={(e) => {
              setUsuario(e.target.value);
            }}
          />
          <input
            type="password"
            id="password"
            className="fadeIn third"
            name="password"
            placeholder="contraseña"
            autoComplete="off"
            value={pass}
            required
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <input type="submit" className="fadeIn fourth" value="Acceder" />
        </form>
      </div>
    </div>
  );
}
