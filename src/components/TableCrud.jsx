import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import DateFnsUtils from "@date-io/date-fns";
import peticiones from "../helpers/Peticiones.helper";

//[{"id":"14","modelo":"21223",
// "marca":"toyota","foto":"14.jpg","fecha_ingreso":"1950-02-15",
// "valor":200000,"createdAt":"2021-02-16T17:17:54.000Z","updatedAt":"2021-02-16T17:18:14.000Z"}]
const data = [
  {
    placa: 1,
    modelo: 2015,
    marca: "toyota",
    foto: "1.jpg",
    ingreso: "2020/01/01",
    valor: "200.000",
  },
];

export default function TableCrud() {
  const [modal, setModal] = useState(false);
  const [modalFile, setModalFile] = useState(false);
  const [file, setFile] = useState(null);
  const [placa, setplaca] = useState("");
  const [modelo, setmodelo] = useState("");
  const [marca, setmarca] = useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [modalEditar, setModalEditar] = useState(false);
  let [datosEditar, setdatosEditar] = useState(data);
  const [state, setstate] = useState({
    data: data,
  });

  const [peticionFinalizada, setpeticionFinalizada] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const da = await peticiones.getTodo();
      setstate({
        data: da["data"],
      });
    }
    fetchData();
  }, [peticionFinalizada]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function limpiarEstados() {
    setFile(null);
    setplaca("");
    setmodelo("");
    setmarca("");
  }
  const guardar = async (e) => {
    if (!placa || !modelo || !file || !marca || !selectedDate) {
      alert("hay campos vacios");
      return "";
    }
    let datos = new FormData();
    let opcion = true;
    datos.append("placa", placa);
    datos.append("modelo", modelo);
    datos.append("foto", file);
    datos.append("marca", marca);
    datos.append("ingreso", selectedDate);

    let estaRegistrado = false;

    state.data.forEach(function (x) {
      if (x.id === placa) estaRegistrado = true;
    });

    if (estaRegistrado) {
      opcion = window.confirm(
        "Esa placa ya esta registrada ¿desea guardar los cambios de todos modos?"
      );
      if (opcion) {
        if (await peticiones.guardarCarro(datos)) {
          const da = await peticiones.getTodo();

          setstate({
            data: da["data"],
          });
          setModal(false);
        }
      }
    } else {
      if (await peticiones.guardarCarro(datos)) {
        const da = await peticiones.getTodo();

        setstate({
          data: da["data"],
        });
        setModal(false);
      }
    }
    limpiarEstados();
  };

  const guardarEditar = async (e) => {
    let datos = new FormData();

    datos.append("placa", placa);
    datos.append("modelo", modelo);
    datos.append("foto", file);
    datos.append("marca", marca);
    datos.append("ingreso", selectedDate);

    if (await peticiones.guardarCarro(datos)) {
      const da = await peticiones.getTodo();

      setstate({
        data: da["data"],
      });
      setModal(false);
    }
    setModalEditar(false);
    limpiarEstados();
  };

  const guardarExcel = async (e) => {
    let datos = new FormData();
    datos.append("excel", file);
    if (file) {
      await peticiones.guardarExcel(datos);
      setModalFile(false);
      setpeticionFinalizada(!peticionFinalizada);
    } else {
      alert("seleccione un archivo");
    }
    setFile(null);
  };

  const eliminar = async (id) => {
    await peticiones.eliminar(id);

    setstate({
      data: (await peticiones.getTodo())["data"],
    });
  };
  useEffect(() => {
    async function fetchData() {
      const da = await peticiones.getTodo();
      setstate({
        data: da["data"],
      });
    }
    fetchData();
  }, []);
  return (
    <div>
      <Container>
        <br />

        <Button
          color="secondary"
          onClick={() => {
            setModalFile(true);
          }}
        >
          Cargar Excel
        </Button>

        {"  "}
        <Button
          color="success"
          onClick={() => {
            setModal(true);
          }}
        >
          Insertar Nuevo carro
        </Button>
        <Table>
          <thead>
            <tr>
              <th>foto</th>
              <th>Placa</th>
              <th>modelo</th>
              <th>marca</th>
              <th>Ingreso</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((elemento) => (
              <tr>
                <td>
                  <img
                    width="150px"
                    height="150px"
                    alt="foto carro"
                    src={
                      "http://localhost:5001/v1/api/carrosimg/" +
                      elemento.foto +
                      "?" +
                      new Date().getTime()
                    }
                  ></img>
                </td>
                <td>{elemento.id}</td>
                <td>{elemento.modelo}</td>
                <td>{elemento.marca}</td>
                <td>{elemento.fecha_ingreso}</td>
                <td>{elemento.valor}</td>

                <td>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      setModalEditar(true);
                      setdatosEditar(elemento);
                      setplaca(elemento.id);
                      setmodelo(elemento.modelo);
                      setmarca(elemento.marca);
                      setSelectedDate(elemento.fecha_ingreso + "T00:00:00");
                    }}
                  >
                    Editar
                  </Button>{" "}
                  <Button color="danger" onClick={() => eliminar(elemento.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={modal} centered>
        <ModalHeader>
          <div>
            <h3>Insertar nuevo carro</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Placa:</label>
            <input
              autoComplete="off"
              className="form-control"
              name="Placa"
              aria-required="true"
              validations="minLength:2"
              type="text"
              onChange={(e) => {
                setplaca(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <label>Modelo:</label>
            <input
              autoComplete="off"
              className="form-control"
              name="modelo"
              type="number"
              required
              onChange={(e) => {
                setmodelo(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <label>Marca:</label>
            <input
              required
              autoComplete="off"
              className="form-control"
              name="marca"
              type="text"
              onChange={(e) => {
                setmarca(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Fecha de Ingreso"
                format="yyyy/MM/dd"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              ></KeyboardDatePicker>
            </MuiPickersUtilsProvider>
          </FormGroup>
          <FormGroup>
            <label>Foto:</label>
            <input
              className="form-control"
              name=""
              accept=".jpg,.png"
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={(e) => {
              setModal(false);
            }}
          >
            Cerrar
          </Button>
          <Button color="primary" onClick={(e) => guardar()}>
            Guardar
          </Button>{" "}
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalFile} animation="off" centered>
        <ModalHeader>
          <div>
            <h3>Cargar Archivo Excel</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Archivo:</label>
            <input
              className="form-control"
              required
              name=""
              type="file"
              accept=".xlsx,.xl"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={(e) => {
              setModalFile(false);
            }}
          >
            Cerrar
          </Button>
          <Button color="primary" onClick={() => guardarExcel()}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar} animation="off" centered>
        <ModalHeader>
          <div>
            <h3>Editar este carro</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Placa:</label>
            <input
              readOnly
              autoComplete="off"
              className="form-control"
              name="Placa"
              type="text"
              onChange={(e) => {
                setplaca(e.target.value);
              }}
              value={placa}
            />
          </FormGroup>
          <FormGroup>
            <label>Modelo:</label>
            <input
              required
              autoComplete="off"
              className="form-control"
              name="modelo"
              type="text"
              value={modelo}
              onChange={(e) => {
                setmodelo(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <label>Marca:</label>
            <input
              required
              autoComplete="off"
              className="form-control"
              name="marca"
              type="text"
              value={marca}
              onChange={(e) => {
                setmarca(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Fecha de Ingreso"
                format="yyyy-MM-dd"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              ></KeyboardDatePicker>
            </MuiPickersUtilsProvider>
          </FormGroup>
          <FormGroup>
            <label>Foto:</label>
            <input
              className="form-control"
              name=""
              accept=".jpg,.png"
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={(e) => {
              setModalEditar(false);
            }}
          >
            Cerrar
          </Button>
          <Button color="primary" onClick={(e) => guardarEditar()}>
            Guardar
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
}
