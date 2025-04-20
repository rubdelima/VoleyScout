import Header from "../components/header";
import Title from "../components/title";
import Layout from "../components/layout";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ActionType = "Saque" | "Ataque" | "Recepção" | "Bloqueio" | "Levantamento";

interface StatRow {
  id: number;
  name: string;
  tentativas: number;
  acertos: number;
  pontos: number;
  erros: number;
  indicePrecisao: string;
  evolucao?: {
    valor: string;
    status: "positivo" | "negativo" | "neutro";
  };
};

function Estatisticas() {
  const { action } = useParams<{ action?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"geral" | "por-acao">("geral");
  const [activeAction, setActiveAction] = useState<ActionType>((action as ActionType) || "Saque");

  // Mock data for general statistics
  const generalStats: StatRow[] = [
    {
      id: 1,
      name: "Saque",
      tentativas: 6,
      acertos: 3,
      pontos: 3,
      erros: 0,
      indicePrecisao: "100%",
      evolucao: {
        valor: "+12%",
        status: "positivo",
      },
    },
    {
      id: 2,
      name: "Ataque",
      tentativas: 4,
      acertos: 3,
      pontos: 0,
      erros: 1,
      indicePrecisao: "75%",
      evolucao: {
        valor: "-15%",
        status: "negativo",
      },
    },
    {
      id: 3,
      name: "Recepção",
      tentativas: 4,
      acertos: 3,
      pontos: 0,
      erros: 1,
      indicePrecisao: "75%",
      evolucao: {
        valor: "+12%",
        status: "positivo",
      },
    },
    {
      id: 4,
      name: "Bloqueio",
      tentativas: 4,
      acertos: 1,
      pontos: 0,
      erros: 3,
      indicePrecisao: "25%",
      evolucao: {
        valor: "0%",
        status: "neutro",
      },
    },
    {
      id: 5,
      name: "Levantamento",
      tentativas: 4,
      acertos: 2,
      pontos: 0,
      erros: 1,
      indicePrecisao: "50%",
      evolucao: {
        valor: "-25%",
        status: "negativo",
      },
    },
  ];

  // Mock data for action-specific statistics (Saque)
  const actionStats: StatRow[] = [
    {
      id: 1,
      name: "1",
      tentativas: 6,
      acertos: 3,
      pontos: 3,
      erros: 0,
      indicePrecisao: "x%",
    },
    {
      id: 2,
      name: "2",
      tentativas: 4,
      acertos: 3,
      pontos: 0,
      erros: 1,
      indicePrecisao: "x%",
    },
    {
      id: 3,
      name: "3",
      tentativas: 0,
      acertos: 0,
      pontos: 0,
      erros: 0,
      indicePrecisao: "-",
    },
    {
      id: 4,
      name: "4",
      tentativas: 0,
      acertos: 0,
      pontos: 0,
      erros: 0,
      indicePrecisao: "-",
    },
    {
      id: 5,
      name: "5",
      tentativas: 0,
      acertos: 0,
      pontos: 0,
      erros: 0,
      indicePrecisao: "-",
    },
  ];

  const getEvolucaoStyle = (status?: "positivo" | "negativo" | "neutro") => {
    switch (status) {
      case "positivo":
        return "bg-[#99D2B7] text-[#206922]";
      case "negativo":
        return "bg-[#F2A4A4] text-[#DB1D1D]";
      case "neutro":
        return "bg-[#E5E5E5] text-[#666666]";
      default:
        return "";
    };
  };

  const handleActionChange = (action: ActionType) => {
    setActiveAction(action);
  };

  const formatValue = (value: number) => {
    return value === 0 ? "-" : value.toString();
  };

  return (
    <div className="flex flex-col align-center font-nunito">
      <Header />
      <Layout>
        <Title title="Estatísticas" showBackButton />

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4">Geral</h3>

          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#CEF2FF] text-[#00729B]">
                  <th className="p-3 text-left">Ação</th>
                  <th className="p-3 text-center">Tentativas</th>
                  <th className="p-3 text-center">Acertos</th>
                  <th className="p-3 text-center">Pontos</th>
                  <th className="p-3 text-center">Erros</th>
                  <th className="p-3 text-center">Índice de precisão</th>
                  <th className="p-3 text-center">Evolução (última partida)</th>
                </tr>
              </thead>
              <tbody>
                {generalStats.map((stat, index) => (
                  <tr key={stat.id} className={index % 2 === 0 ? "bg-[#E5F8FF]" : "bg-white"}>
                    <td className="p-3 text-left">{stat.name}</td>
                    <td className="p-3 text-center">{stat.tentativas}</td>
                    <td className="p-3 text-center">{stat.acertos}</td>
                    <td className="p-3 text-center">{stat.pontos}</td>
                    <td className="p-3 text-center">{stat.erros}</td>
                    <td className="p-3 text-center">
                      {stat.name === "Bloqueio" && <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>}
                      {stat.indicePrecisao}
                    </td>
                    <td className="p-3 text-center">
                      {stat.evolucao && (
                        <span className={`px-3 py-1 rounded-full ${getEvolucaoStyle(stat.evolucao.status)}`}>
                          {stat.evolucao.valor}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-lg mb-4">Por ação</h3>

          <div className="mb-4">
            <div className="flex border-b">
              {["Saque", "Ataque", "Recepção", "Bloqueio", "Levantamento"].map((action) => (
                <button
                  key={action}
                  className={`px-4 py-2 font-semibold ${
                    activeAction === action ? "text-[#00729B] border-b-2 border-[#00729B]" : "text-gray-500"
                  }`}
                  onClick={() => handleActionChange(action as ActionType)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#CEF2FF] text-[#00729B]">
                  <th className="p-3 text-left">Set</th>
                  <th className="p-3 text-center">Tentativas</th>
                  <th className="p-3 text-center">Acertos</th>
                  <th className="p-3 text-center">Pontos</th>
                  <th className="p-3 text-center">Erros</th>
                  <th className="p-3 text-center">Índice de precisão</th>
                </tr>
              </thead>
              <tbody>
                {actionStats.map((stat, index) => (
                  <tr key={stat.id} className={index % 2 === 0 ? "bg-[#E5F8FF]" : "bg-white"}>
                    <td className="p-3 text-left">{stat.name}</td>
                    <td className="p-3 text-center">{stat.tentativas || "-"}</td>
                    <td className="p-3 text-center">{stat.acertos || "-"}</td>
                    <td className="p-3 text-center">{stat.pontos || "-"}</td>
                    <td className="p-3 text-center">{stat.erros || "-"}</td>
                    <td className="p-3 text-center">{stat.indicePrecisao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-[#00729B] text-[#00729B] rounded-full font-semibold"
            >
              Página inicial
            </button>
            <button
              onClick={() => navigate("/estatisticas/gerais")}
              className="px-4 py-2 bg-[#00729B] text-white rounded-full font-semibold"
            >
              Estatísticas gerais
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Estatisticas;
