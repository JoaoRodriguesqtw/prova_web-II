import { useState } from "react";

function Crud(props) {
  const [form, setForm] = useState({ nome: "", pessoas: "" });
  const [reservas, setReservas] = useState([]);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null);

  const mudar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  function editar(id) {
    const reserva = reservas.find((item) => item.id === id);
    setForm({ nome: reserva.nome, pessoas: reserva.pessoas });
    setEditando(id);
  }

  const enviar = (evento) => {
    evento.preventDefault();

    if (form.nome === "" || form.pessoas === "") {
      setErro("Preencha os dois campos.");
      return;
    }
    setErro("");

    if (editando !== null) {
      setReservas(
        reservas.map((item) => {
          if (item.id === editando) {
            return {
              ...item,
              nome: form.nome,
              pessoas: form.pessoas,
              
              
            };

          } else {
            return item;
          }
        }),
      );
    } else {
      setReservas([
        ...reservas,
        { id: Date.now(), nome: form.nome, pessoas: form.pessoas },
      ]);
    }
    setForm({ nome: "", pessoas: "" });
    setEditando(null);
  };

  return (
    <div className="centralizar">
      <h2>{props.titulo}</h2>
      <div className="Reservas">
        <form onSubmit={enviar}>
          <label>
            Nome:
            <input
              type="text"
              value={form.nome}
              onChange={(e) => mudar("nome", e.target.value)}
            />
          </label>
          <label>
            Pessoas:
            <input
              type="number"
              value={form.pessoas}
              onChange={(e) => mudar("pessoas", e.target.value)}
            />
          </label>
          <button type="submit"> {editando === null ? "enviar" : "salvar"}</button>
          
          
        </form>
       

        {reservas.map((item) => (
          <div key={item.id} className={editando === item.id ? "item-editando" : "item-reserva" }>
            <p>
            Reserva de: {item.nome} | Pessoas: {item.pessoas}
        {erro !== "" && <p className="erro">{erro}</p>}
              <button className="update" onClick={() => editar(item.id)}>
                Editar
              </button>
              {editando !== null && ( <button onClick={()=> setForm({ nome: "", pessoas: "" }, setEditando(null))}>Cancelar</button>)}
<button
                className="delete"
                onClick={() =>
                  setReservas(
                    reservas.filter((reserva) => reserva.id !== item.id),
                  )

                }
              >
                Deletar
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Crud;
