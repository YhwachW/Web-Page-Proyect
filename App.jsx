import { useState, useEffect } from "react";
import { format } from "date-fns";

const horariosDisponibles = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00"
];

export default function App() {
  const [reservas, setReservas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    try {
      const dataGuardada = localStorage.getItem("reservas");
      if (dataGuardada) {
        setReservas(JSON.parse(dataGuardada));
      }
    } catch (e) {
      console.error("Error leyendo reservas del localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  const reservar = () => {
    if (!nombre || !telefono || !fecha || !hora) return;
    const nuevaReserva = { nombre, telefono, fecha, hora };
    setReservas([...reservas, nuevaReserva]);
    setNombre("");
    setTelefono("");
    setFecha("");
    setHora("");
  };

  const estaOcupado = (fecha, hora) => {
    return reservas.some(r => r.fecha === fecha && r.hora === hora);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">
          Agenda tu hora - Estética Rosada
        </h1>

        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full p-2 border rounded" />
              <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full p-2 border rounded" />
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-2 border rounded" />
              <select
                value={hora}
                onChange={e => setHora(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecciona una hora</option>
                {horariosDisponibles.sort().map(h => (
                  <option key={h} value={h} disabled={estaOcupado(fecha, h)}>
                    {h} {estaOcupado(fecha, h) ? "(Ocupado)" : ""}
                  </option>
                ))}
              </select>
              <button onClick={reservar} className="w-full bg-pink-500 text-white hover:bg-pink-600 p-2 rounded">
                Reservar
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-pink-600 mb-2">Horas Reservadas</h2>
        <div className="grid gap-4">
          {reservas.map((r, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p><strong>Nombre:</strong> {r.nombre}</p>
              <p><strong>Teléfono:</strong> {r.telefono}</p>
              <p><strong>Fecha:</strong> {r.fecha}</p>
              <p><strong>Hora:</strong> {r.hora}</p>
            </div>
          ))}
          {reservas.length === 0 && <p className="text-gray-500">No hay reservas todavía.</p>}
        </div>
      </div>
    </div>
  );
}
