import React from "react";

type PlayerAnalysisProps = {
  jogador: string;
  numero: number;
  posicao: string;
  analista: string;
  data: string;
  hora: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const PlayerAnalysisInfo: React.FC<PlayerAnalysisProps> = ({
  jogador,
  numero,
  posicao,
  analista,
  data,
  hora,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="border p-6 rounded-lg shadow-md bg-white w-full mx-auto">
      <h4 className="text-xl font-semibold mb-4">Informações do jogador</h4>
      <div className="w-full bg-slate-200 h-0.5 mb-5"></div>

      <div className="mb-4">
        <p className="font-semibold">Jogador:</p>
        <h3 className="font-bold">{jogador}</h3>
      </div>
      <div className="flex justify-start mb-4 gap-5">
        <div>
          <p className="font-semibold">Número:</p>
          <h3 className="font-semibold">{numero}</h3>
        </div>
        <div>
          <p className="font-semibold">Posição:</p>
          <h3 className="font-semibold">{posicao}</h3>
        </div>
      </div>
      <h4 className="font-semibold mb-4">Informações da análise</h4>
    <div className="w-full bg-slate-200 h-0.5 mb-5"></div>
    <div className="flex gap-10">
      <div className="mb-4">
        <p className="font-semibold">Analista:</p>
        <p>{analista}</p>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">Data:</p>
          <p className="font-bold">{data}</p>
        </div>
        <div className="ml-10">
          <h4 className="font-semibold">Hora:</h4>
          <h4 className="font-bold" >{hora}</h4>
        </div>
      </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="border-2 border-[#00729B] text-[#00729B] px-4 py-2 rounded-3xl w-[170px] font-semibold"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-[#00729B] text-white px-4 py-2 rounded-3xl w-[170px] font-semibold"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default PlayerAnalysisInfo;
