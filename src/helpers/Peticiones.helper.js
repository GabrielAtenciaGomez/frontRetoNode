import axios from "axios";

const urlBase = "http://localhost:5001/v1/api";
var token = window.localStorage.getItem("token") || "";

var _axios = axios.create({
  baseURL: urlBase,
  headers: {
    Authorization: token,
    "Content-Type": "multipart/form-data",
  },
});
var _axiosDelete = axios.create({
  baseURL: urlBase,
  headers: {
    Authorization: token,
  },
});
class Peticiones {
  async login(id, password) {
    let resultado = false;

    try {
      const { token, userToken } = (
        await axios.post(urlBase + "/login/signin", {
          id: id,
          password: password,
        })
      ).data;
      if (token) {
        window.localStorage.setItem("token", "bearer " + token);
        const { id, name, surname, correo } = userToken;

        window.localStorage.setItem("id", id);
        window.localStorage.setItem("name", name);
        window.localStorage.setItem("surname", surname);
        window.localStorage.setItem("correo", correo);
        resultado = true;
      }
    } catch (error) {
      console.log(error.message);
    }
    return resultado;
  }

  async isLoged() {
    let resultado = false;
    try {
      resultado = (await _axios.post("login/isloged"))["data"];
    } catch (error) {
      resultado = false;
    }
    return resultado;
  }

  async guardarCarro(_formdata) {
    let resultado = null;
    try {
      resultado = await _axios.post("carros/insertar", _formdata);
    } catch (error) {
      console.log(error);
    }
    return resultado;
  }

  async guardarExcel(_formdata) {
    let resultado = null;
    try {
      resultado = await _axios.post("carros/excel", _formdata);
    } catch (error) {
      console.log(error);
    }
    return resultado;
  }
  async getTodo() {
    let resultado = null;
    try {
      resultado = await _axios.post("carros/getAll");
    } catch (error) {
      console.log(error);
    }
    return resultado;
  }
  async getFoto(id) {
    let resultado = null;
    try {
      resultado = await _axios.get("carros/image/?id=" + id);
    } catch (error) {
      console.log(error);
    }
    return resultado;
  }
  async eliminar(id) {
    let resultado = null;
    try {
      resultado = await _axiosDelete.post("carros/eliminar", { id: id });
    } catch (error) {
      console.log(error);
    }
    return resultado;
  }
}
export default new Peticiones();
