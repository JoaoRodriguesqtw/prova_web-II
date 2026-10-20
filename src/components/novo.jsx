import { useState } from "react";

function Crud(props) {
  const [form, setForm] = useState({ dsCliente : "", dsServico : "", nuValor: "" });
  const [reservas, setReservas] = useState([]);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(null);

  const mudar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  function editar(idOrdem) {
    const reserva = reservas.find((item) => item.idOrdem === idOrdem);
    setForm({ dsCliente: reserva.dsCliente, dsServico: reserva.dsServico, nuValor: String(reserva.nuValor)});
    setEditando(idOrdem);
    setErro("")
  }

  function concluir(idOrdem) {
    setReservas(
      reservas.map((item) => {
        if (item.idOrdem === idOrdem) {
          return { ...item, fgConcluida: !item.fgConcluida };
        } else {
          return item;
        }
      }),
    );
  }

  const enviar = (evento) => {
    evento.preventDefault();

    if (form.dsCliente.trim() === "" || form.dsServico.trim() === "") {
      setErro("Preencha o cliente e o serviço.");
      return;
    }

    const valor = Number(form.nuValor);
    // zero é válido (e falsy), por isso a comparação é explícita
    if (form.nuValor === "" || Number.isNaN(valor) || valor < 0) {
      setErro("Informe um valor numérico maior ou igual a 0.");
      return;
    }
    setErro("");

    if (editando !== null) {
      setReservas(
        reservas.map((item) => {
          if (item.idOrdem === editando) {
            return {
              ...item,
              dsCliente : form.dsCliente,
              dsServico: form.dsServico,
              nuValor :  valor,
            };

          } else {
            return item;
          }
        }),
      );
    } else {
      setReservas([
        ...reservas,
        { idOrdem: crypto.randomUUID(), dsCliente : form.dsCliente, dsServico : form.dsServico, nuValor: valor, fgConcluida: false },
      ]);
    }
    setForm({ dsCliente: "", dsServico: "",nuValor: "" });
    setEditando(null);
  };
  
  const emAberto = reservas.filter((item) => !item.fgConcluida);
  const valorEmAberto = emAberto.reduce((soma, item) => soma + item.nuValor, 0);

  return (
    <div className="centralizar">
      <h2>{props.titulo}</h2>

      <form onSubmit={enviar}>
        <label>Cliente:</label>
        <input
          type="text"
          value={form.dsCliente}
          onChange={(e) => mudar("dsCliente", e.target.value)}
        />
        <label>Serviço:</label>
        <input
          type="text"
          value={form.dsServico}
          onChange={(e) => mudar("dsServico", e.target.value)}
        />
        <label>Valor:</label>
        <input
          type="number"
          step="any"
          value={form.nuValor}
          onChange={(e) => mudar("nuValor", e.target.value)}
        />
        <button type="submit">{editando === null ? "enviar" : "salvar"}</button>
      </form>

      {erro !== "" && <p className="erro">{erro}</p>}

      <p>Total de ordens: {reservas.length}</p>
      <p>Em aberto: {emAberto.length}</p>
      <p>Valor em aberto: R$ {valorEmAberto.toFixed(2)}</p>

      {reservas.length === 0 && <p>Não há ordens de serviço cadastradas.</p>}

      {reservas.map((item) => (
        <div
          key={item.idOrdem}
          className={(editando === item.idOrdem ? "item-editando" : "item-reserva") + (item.fgConcluida ? " item-concluida" : "")}
        >
          <p>Cliente: {item.dsCliente}</p>
          <p>Serviço: {item.dsServico}</p>
          <p>Valor: R$ {item.nuValor.toFixed(2)}</p>
          {item.fgConcluida && <p>Concluída</p>}
          <p>fgConcluida: {String(item.fgConcluida)}</p>
          <button onClick={() => concluir(item.idOrdem)}>
            {item.fgConcluida ? "Reabrir" : "Concluir"}
          </button>
          <button className="update" onClick={() => editar(item.idOrdem)}>
            Editar
          </button>
          {editando === item.idOrdem && (
            <button
              onClick={() => {
                setForm({ dsCliente: "", dsServico: "", nuValor: "" });
                setEditando(null);
                setErro("");
              }}
            >
              Cancelar
            </button>
          )}
          <button
            className="delete"
            onClick={() => {
              setReservas(
                reservas.filter((reserva) => reserva.idOrdem !== item.idOrdem),
              );
              if (editando === item.idOrdem) {
                setForm({ dsCliente: "", dsServico: "", nuValor: "" });
                setEditando(null);
              }
            }}
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}

export default Crud;