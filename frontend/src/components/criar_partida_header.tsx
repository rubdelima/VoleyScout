import React from "react";

type CriarPartidaHeaderProps = {
  tipoPartida: string;
  setTipoPartida: (value: string) => void;
  resultado: string;
  setResultado: (value: string) => void;
  data: string;
  setData: (value: string) => void;
};

const CriarPartidaHeader: React.FC<CriarPartidaHeaderProps> = ({
  tipoPartida,
  setTipoPartida,
  resultado,
  setResultado,
  data,
  setData,
}) => {
  return (
    <div className="flex gap-10 mb-6 ">
      <div className="w-1/6">
        <p className="font-semibold">Tipo de partida</p>
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipoPartida"
              value="Partida isolada"
              checked={tipoPartida === "Partida isolada"}
              onChange={() => setTipoPartida("Partida isolada")}
              className="accent-[#00729B]"
            />
            Partida isolada
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipoPartida"
              value="Torneio"
              checked={tipoPartida === "Torneio"}
              onChange={() => setTipoPartida("Torneio")}
              className="accent-blue-500"
            />
            Torneio
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="font-semibold">Resultado</p>
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="resultado"
              value="Vitória"
              checked={resultado === "Vitória"}
              onChange={() => setResultado("Vitória")}
              className="accent-blue-500"
            />
            Vitória
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="resultado"
              value="Derrota"
              checked={resultado === "Derrota"}
              onChange={() => setResultado("Derrota")}
              className="accent-blue-500"
            />
            Derrota
          </label>
        </div>
      </div>

      <div>
        <p className="font-semibold">
          Data <span className="text-red-500">*</span>
        </p>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border-2 rounded-md border-[#00729B] p-2 w-40 outline-blue-500"
        />
      </div>
    </div>
  );
};

export default CriarPartidaHeader;
