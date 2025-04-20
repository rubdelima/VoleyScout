import React, { useState } from "react";
import CriarPartidaHeader from "./criar_partida_header";
 
import lixeira from "../assets/lixeira.png"
import PlayerAnalysisInfo from "./player_analysis_info";

type SetType = {
  analisado: string;
  adversario: string;
};
const CriarPartida = () => {
  const [tipoPartida, setTipoPartida] = useState("Partida isolada");
  const [resultado, setResultado] = useState("Vitória");
  const [data, setData] = useState("");
  const [equipe, setEquipe] = useState({ nome: "", sigla: "" });
  const [adversario, setAdversario] = useState({ nome: "", sigla: "" });

  const [sets, setSets] = useState<SetType[]>([]);

  const adicionarSet = () => {
    setSets([...sets, { analisado: "", adversario: "" }]);
  };

  const atualizarSet = (index: number, campo: keyof SetType, valor: string) => {
    const novosSets = [...sets];
    novosSets[index][campo] = valor;
    setSets(novosSets);
  };

  const removerSet = (index: number) => {
    const novosSets = sets.filter((_, i) => i !== index);
    setSets(novosSets);
  };

  return (
    <div className="p-6 ">
        <CriarPartidaHeader
        tipoPartida={tipoPartida}
        setTipoPartida={setTipoPartida}
        resultado={resultado}
        setResultado={setResultado}
        data={data}
        setData={setData}
      />


      <h2 className="text-lg font-semibold mb-3">Times</h2>
      <div className="flex gap-10 justify-center mb-6">
        <div className="border-2 border-[#00729B] p-4 rounded-2xl w-1/2">
          <label className="block text-sm font-semibold">
            Equipe analisada <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome da equipe"
            value={equipe.nome}
            onChange={(e) => setEquipe((prev) => ({ ...prev, nome: e.target.value }))}
            className="border p-2 rounded-md w-full mt-2"
          />
          <label className="block text-sm font-semibold mt-2">Sigla *</label>
          <input
            type="text"
            placeholder="Digite"
            value={equipe.sigla}
            onChange={(e) => setEquipe((prev) => ({ ...prev, sigla: e.target.value }))}
            className="border p-2 rounded-md w-full mt-2"
          />
        </div>

        <span className="text-2xl font-bold self-center">X</span>

        {/* Equipe Adversária */}
        <div className="border-2 border-[#00729B] p-4 rounded-2xl w-1/2">
          <label className="block text-sm font-semibold">
            Equipe adversária <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome da equipe"
            value={adversario.nome}
            onChange={(e) => setAdversario((prev) => ({ ...prev, nome: e.target.value }))}
            className="border p-2 rounded-md w-full mt-2"
          />
          <label className="block text-sm font-semibold mt-2">Sigla *</label>
          <input
            type="text"
            placeholder="Digite"
            value={adversario.sigla}
            onChange={(e) => setAdversario((prev) => ({ ...prev, sigla: e.target.value }))}
            className="border p-2 rounded-md w-full mt-2"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Sets</h2>
      <div>
        {sets.map((set, index) => (
          <div key={index} className="flex justify-between items-center bg-[#CEF2FF] p-4 mb-2 rounded-md">
            <span className="font-semibold w-full text-[#00729B]">Set {index + 1}</span>
            <div className="flex gap-4 items-center w-1/6">
              <label className="flex flex-col">
                <span className="text-sm text-[#00729B]">Analisado</span>
                <input
                  type="number"
                  value={set.analisado}
                  onChange={(e) => atualizarSet(index, "analisado", e.target.value)}
                  className="border-2 border-[#00729B] p-2 w-24 text-center rounded-md"
                />
              </label>
              <span className="text-xl font-bold mt-5 text-[#00729B]">X</span>
              <label className="flex flex-col">
                <span className="text-sm text-[#00729B]">Adversário</span>
                <input
                  type="number"
                  value={set.adversario}
                  onChange={(e) => atualizarSet(index, "adversario", e.target.value)}
                  className="border-2 border-[#00729B] p-2 w-24 text-center rounded-md"
                />
              </label>
            </div>
            <button onClick={() => removerSet(index)} className="text-red-500 text-lg mt-4 mx-8">
              <img src={lixeira} alt=""></img>
            </button>
          </div>
        ))}
      </div>

      {/* Botão de adicionar set */}
      <button onClick={adicionarSet} className="border-2 border-[#00729B] text-[#00729B] px-4 py-2 rounded-3xl mt-4 w-full font-semibold">
        + Adicionar Set
      </button>

      <div className="mb-10"></div>

      <PlayerAnalysisInfo
        jogador="Gabriela Braga Guimarães"
        numero={10}
        posicao="Ponteiro"
        analista="Nome do analista que criou a análise"
        data="16/01/2025"
        hora="09:56"
        onCancel={() => console.log("Cancelado")}
        onConfirm={() => console.log("Confirmado")}
      />
    </div>
  );
};

export default CriarPartida;
