import { useState } from "react";



const ordens_iniciais = [
  {
    idOrdem: crypto.randomUUID(),
    dsCliente: "Marina Alves",
    dsServico: "Troca de pastilhas de freio",
    nuValor: 85,
    fgConcluida: false,
  },
  {
    idOrdem: crypto.randomUUID(),
    dsCliente: "Carlos Pereira",
    dsServico: "Regulagem de câmbio",
    nuValor: 60.5,
    fgConcluida: true,
  },
  {
    idOrdem: crypto.randomUUID(),
    dsCliente: "Fernanda Lima",
    dsServico: "Troca de corrente",
    nuValor: 120,
    fgConcluida: false,
  },
];










function Crud(props) {
  const [form, setForm] = useState({ dsCliente : "", dsServico : "", nuValor: "" });
  const [reservas, setReservas] = useState(ordens_iniciais);
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
  };


  function concluir(idOrdem) {
    setReservas(
      reservas.map((item) => {
        if (item.idOrdem === idOrdem) {
          return { ...item, fgConcluida: !item.fgConcluida };
        } else {
          return item; }}) ) }




  const enviar = (evento) => {
    evento.preventDefault();

    if (form.dsCliente === "" || form.dsServico === "") {
      setErro("Preencha os dois campos.");
      return;
    }
    setErro("");

    const valor = Number(form.nuValor);
    if (form.nuValor === "" || Number.isNaN(valor) || valor < 0) {
      setErro("Informe um valor numérico maior ou igual a 0.");
      return;}
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
      <div className="Reservas">
        <form onSubmit={enviar}>
          <label>
            Cliente:
            <input
              type="text"
              value={form.dsCliente}
              onChange={(e) => mudar("dsCliente", e.target.value)}
            />
          </label>
          <label>
            Servico:
            <input
              type="text"
              value={form.dsServico}
              onChange={(e) => mudar("dsServico", e.target.value)}
            />
            valor: 
            <input 
            type="number"
            step="any"
            value={form.nuValor}
            onChange={(e) => mudar("nuValor", e.target.value)}/>
          </label>
          <button type="submit"> {editando === null ? "enviar" : "salvar"}</button>
          
          
        </form>
        {erro !== "" && <p className="erro">{erro}</p>} 
        
      <p>Total de ordens: {reservas.length}| Em aberto: {emAberto.length}| Valor em aberto: R$ {valorEmAberto.toFixed(2)}</p>
      {reservas.length === 0 && <p>Não há ordens de serviço cadastradas.</p>}
       

        {reservas.map((item) => (
          <div key={item.idOrdem}
          className={(editando === item.idOrdem ? "item-editando" : "item-reserva") + (item.fgConcluida ? " item-concluida" : "")}>
            <p>
            Cliente: {item.dsCliente} | Serviço: {item.dsServico} | Valor: {item.nuValor} | {item.fgConcluida && <p>Concluída</p>}  Concluída: {String(item.fgConcluida)}  <button onClick={() => concluir(item.idOrdem)}>{item.fgConcluida ? "Reabrir" : "Concluir"}</button>
        
              <button className="update" onClick={() => editar(item.idOrdem)}>
                Editar
              </button>
              {editando !== null && ( <button onClick={()=> setForm({ dsCliente: "", dsServico: "", nuValor:"" }, setEditando(null))}>Cancelar</button>)}
<button
                className="delete"
                onClick={() =>
                  setReservas(
                    reservas.filter((reserva) => reserva.idOrdem !== item.idOrdem),
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
