import Header from "../components/header";
import Title from "../components/title";
import Layout from "../components/layout";
import type React from "react";
import { useState } from "react";
import BotaoCallback, { BotaoCallbackStyle } from "../components/botao_callback";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface NovaPartidaProps {
  id: number;
  anfitriao: string;
  adversario: string;
};

function NovaPartida() {
  const navigate = useNavigate();
  const [tipoPartida, setTipoPartida] = useState<"isolada" | "torneio">("isolada");
  const [resultado, setResultado] = useState<"vitoria" | "derrota">("vitoria");
  const [data, setData] = useState<string>("");

  const [equipeAnfitria, setEquipeAnfitria] = useState<string>("");
  const [siglaAnfitria, setSiglaAnfitria] = useState<string>("");
  const [equipeAdversaria, setEquipeAdversaria] = useState<string>("");
  const [siglaAdversaria, setSiglaAdversaria] = useState<string>("");

  const [sets, setSets] = useState<NovaPartidaProps[]>([
    { id: 1, anfitriao: "", adversario: "" },
    { id: 2, anfitriao: "", adversario: "" },
  ]);

  const handleAddSet = () => {
    const newSetId = sets.length > 0 ? Math.max(...sets.map((set) => set.id)) + 1 : 1;
    setSets([...sets, { id: newSetId, anfitriao: "", adversario: "" }]);
  };

  const handleRemoveSet = (id: number) => {
    setSets(sets.filter((set) => set.id !== id));
  };

  const handleSetScoreChange = (id: number, team: "anfitriao" | "adversario", value: string) => {
    const numericValue = value === "" ? "" : value.replace(/[^0-9]/g, "");

    setSets(
      sets.map((set) => {
        if (set.id === id) {
          return { ...set, [team]: numericValue };
        }
        return set;
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form submission
    console.log({
      tipoPartida,
      resultado,
      data,
      equipeAnfitria,
      siglaAnfitria,
      equipeAdversaria,
      siglaAdversaria,
      sets,
    });

    // Navigate to appropriate page after submission
    navigate("/meu-time");
  }

  const RADIO_INPUT_CLASSNAMES = "mr-2 w-5 h-5 text-primary bg-white border-disabled focus:ring-primary";

  return (
    <div className="flex flex-col align-center font-nunito">
      <Header />
      <Layout>
        <Title title="Nova partida" showBackButton />

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Tipo de partida */}
            <div>
              <h3 className="font-semibold text-[#00729B] mb-3">Tipo de partida</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoPartida"
                    checked={tipoPartida === "isolada"}
                    onChange={() => setTipoPartida("isolada")}
                    className={RADIO_INPUT_CLASSNAMES}
                  />
                  <span>Partida isolada</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoPartida"
                    checked={tipoPartida === "torneio"}
                    onChange={() => setTipoPartida("torneio")}
                    className={RADIO_INPUT_CLASSNAMES}
                  />
                  <span>Torneio</span>
                </label>
              </div>
            </div>

            {/* Resultado */}
            <div>
              <h3 className="font-semibold text-[#00729B] mb-3">Resultado</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="resultado"
                    checked={resultado === "vitoria"}
                    onChange={() => setResultado("vitoria")}
                    className={RADIO_INPUT_CLASSNAMES}
                  />
                  <span>Vitória</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="resultado"
                    checked={resultado === "derrota"}
                    onChange={() => setResultado("derrota")}
                    className={RADIO_INPUT_CLASSNAMES}
                  />
                  <span>Derrota</span>
                </label>
              </div>
            </div>

            {/* Data */}
            <div>
              <h3 className="font-semibold text-[#00729B] mb-3">Data</h3>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="border border-[#00729B] rounded-md p-2 w-full"
              />
            </div>
          </div>

          {/* Times */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#00729B] mb-3">Times</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="mb-2">
                  <label className="text-sm text-gray-600">Equipe anfitriã*</label>
                </div>
                <input
                  type="text"
                  value={equipeAnfitria}
                  onChange={(e) => setEquipeAnfitria(e.target.value)}
                  placeholder="Nome da equipe"
                  className="border border-[#00729B] rounded-md p-2 w-full"
                  required
                />
              </div>

              <div className="w-24">
                <div className="mb-2">
                  <label className="text-sm text-gray-600">Sigla*</label>
                </div>
                <input
                  type="text"
                  value={siglaAnfitria}
                  onChange={(e) => setSiglaAnfitria(e.target.value.toUpperCase().substring(0, 3))}
                  placeholder="XXX"
                  className="border border-[#00729B] rounded-md p-2 w-full text-center uppercase"
                  maxLength={3}
                  required
                />
              </div>

              <div className="flex items-center justify-center text-2xl font-bold text-[#00729B]">X</div>

              <div className="flex-1">
                <div className="mb-2">
                  <label className="text-sm text-gray-600">Equipe adversária*</label>
                </div>
                <input
                  type="text"
                  value={equipeAdversaria}
                  onChange={(e) => setEquipeAdversaria(e.target.value)}
                  placeholder="Nome da equipe"
                  className="border border-[#00729B] rounded-md p-2 w-full"
                  required
                />
              </div>

              <div className="w-24">
                <div className="mb-2">
                  <label className="text-sm text-gray-600">Sigla*</label>
                </div>
                <input
                  type="text"
                  value={siglaAdversaria}
                  onChange={(e) => setSiglaAdversaria(e.target.value.toUpperCase().substring(0, 3))}
                  placeholder="XXX"
                  className="border border-[#00729B] rounded-md p-2 w-full text-center uppercase"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Sets */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#00729B] mb-3">Sets</h3>

            {sets.map((set, index) => (
              <div
                key={set.id}
                className="flex items-center gap-4 mb-2 p-3 rounded-md"
                style={{ backgroundColor: index % 2 === 0 ? "#CEF2FF" : "#E5F8FF" }}
              >
                <div className="w-16">
                  <span className="font-semibold">Set {set.id}</span>
                </div>

                <div className="flex-1 text-right">
                  <label className="text-sm text-gray-600 mr-2">Anfitrião</label>
                  <input
                    type="text"
                    value={set.anfitriao}
                    onChange={(e) => handleSetScoreChange(set.id, "anfitriao", e.target.value)}
                    className="border border-[#00729B] rounded-md p-2 w-16 text-center"
                    maxLength={2}
                  />
                </div>

                <div className="flex items-center justify-center text-xl font-bold text-[#00729B]">X</div>

                <div className="flex-1">
                  <label className="text-sm text-gray-600 mr-2">Adversário</label>
                  <input
                    type="text"
                    value={set.adversario}
                    onChange={(e) => handleSetScoreChange(set.id, "adversario", e.target.value)}
                    className="border border-[#00729B] rounded-md p-2 w-16 text-center"
                    maxLength={2}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSet(set.id)}
                  className="text-[#00729B] p-2"
                  disabled={sets.length <= 1}
                >
                  <Trash2 size={20} className={sets.length <= 1 ? "text-gray-300" : "text-[#00729B]"} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSet}
              className="w-full border border-[#00729B] border-dashed rounded-md p-2 mt-4 text-[#00729B] font-semibold"
            >
              + Adicionar set
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
			
            <BotaoCallback style={BotaoCallbackStyle.Outline} onClick={() => navigate(-1)} type="button">
              Cancelar
            </BotaoCallback>

            <BotaoCallback style={BotaoCallbackStyle.Filled} type="submit">
              Confirmar
            </BotaoCallback>
          </div>
        </form>
      </Layout>
    </div>
  );
};

export default NovaPartida;
