import { useState } from "react";
import BotaoComRota from "./botao_com_rota";

const partidas = [
  {
    id: 1,
    equipe: "Brasil",
    adversario: "Espanha",
    sets: 5,
    resultado: "3x2",
    data: "16/01/2025",
    situacao: "Vitória",
    jogadores: 6,
  },
  {
    id: 2,
    equipe: "Espanha",
    adversario: "Brasil",
    sets: 5,
    resultado: "2x3",
    data: "16/01/2025",
    situacao: "Derrota",
    jogadores: 3,
  },
  {
    id: 3,
    equipe: "Brasil",
    adversario: "Espanha",
    sets: 5,
    resultado: "3x2",
    data: "16/01/2025",
    situacao: "Vitória",
    jogadores: 3,
  },
  {
    id: 4,
    equipe: "Brasil",
    adversario: "Espanha",
    sets: 5,
    resultado: "3x2",
    data: "16/01/2025",
    situacao: "Vitória",
    jogadores: 3,
  },
  {
    id: 5,
    equipe: "Brasil",
    adversario: "Espanha",
    sets: 5,
    resultado: "3x2",
    data: "16/01/2025",
    situacao: "Vitória",
    jogadores: 3,
  },
  {
    id: 6,
    equipe: "Holanda",
    adversario: "Espanha",
    sets: 5,
    resultado: "3x2",
    data: "16/01/2025",
    situacao: "Derrota",
    jogadores: 6,
  },
];

export default function AbaVincularPartida() {
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  const totalPaginas = Math.ceil(partidas.length / itensPorPagina);

  const partidasExibidas = partidas.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  return (
    <div className="p-4">
      <div className="flex items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Todas as partidas</h2>
      </div>

      <table className="w-full border-collapse border-b mt-4">
        <thead className="bg-blue-200 py-5">
          <tr>
            <th className="p-3 py-5">Selecionar</th>
            <th className="p-3 py-5">Equipe</th>
            <th className="p-3 py-5">Adversário</th>
            <th className="p-3 py-5">Nº Sets</th>
            <th className="p-3 py-5">Resultado</th>
            <th className="p-3 py-5">Data</th>
            <th className="p-3 py-5">Situação</th>
            <th className="p-3 py-5">Jogadores analisados</th>
          </tr>
        </thead>
        <tbody>
          {partidasExibidas.map((partida) => (
            <tr key={partida.id} className="text-center">
              <td className="p-2">
                <BotaoComRota texto="Selecionar" route="/nova-analise" size="small" />
              </td>
              <td className="p-2">{partida.equipe}</td>
              <td className="p-2">{partida.adversario}</td>
              <td className="p-2">{partida.sets}</td>
              <td className="p-2">{partida.resultado}</td>
              <td className="p-2">{partida.data}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-2xl max-w-[80px] font-semibold text-center flex justify-center ${
                    partida.situacao === "Vitória" ? "bg-[#99D2B7] text-[#206922]" : "bg-[#F2A4A4] text-[#DB1D1D]"
                  }`}
                >
                  {partida.situacao}
                </span>
              </td>
              <td className="p-2">{partida.jogadores}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span>Exibir </span>
          <select
            className="border rounded p-1"
            value={itensPorPagina}
            onChange={(e) => {
              setItensPorPagina(Number(e.target.value));
              setPagina(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="border px-3 py-1 rounded disabled:opacity-50"
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            {"<"}
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            className="border px-3 py-1 rounded disabled:opacity-50"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            {">"}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 flex flex-col gap-2">
        <h4 className="text-lg font-semibold">Jogador</h4>
        <h2 className="font-bold">Gabriela Braga Guimarães</h2>
        <strong>Número</strong> <p>10</p> <strong>Posição</strong> <p>Ponteiro</p>
        <h3 className="text-lg font-semibold mt-4">Informações da análise</h3>
        <div className="h-0.5 bg-[#D4D4D4]"></div>
        <p>
          <strong>Analista:</strong> Nome do analista que criou a análise
        </p>
        <p>
          <strong>Data:</strong> 16/01/2025 <strong>Hora:</strong> 09:56
        </p>
        <div className="flex justify-end mt-4 gap-4">
          <button className="border px-4 py-2 rounded text-blue-500">Cancelar</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
