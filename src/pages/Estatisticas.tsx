// Estatisticas.tsx
import Header from "../components/header";
import Title from "../components/title";
import Layout from "../components/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

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
}

const actionKeyMap: Record<ActionType, string> = {
  Saque: "serveStats",
  Ataque: "attackStats",
  Recepção: "receptionStats",
  Bloqueio: "blockStats",
  Levantamento: "setStats",
};

const actionLabelMap: Record<string, ActionType> = {
  serve: "Saque",
  attack: "Ataque",
  receive: "Recepção",
  block: "Bloqueio",
  set: "Levantamento",
};

const getEvolucaoStyle = (status?: "positivo" | "negativo" | "neutro") => {
  const styles = {
    positivo: "bg-[#99D2B7] text-[#206922]",
    negativo: "bg-[#F2A4A4] text-[#DB1D1D]",
    neutro: "bg-[#E5E5E5] text-[#666666]",
  };
  return status ? styles[status] : "";
};

const formatStatRow = (item: any, index: number, name: string): StatRow => ({
  id: index + 1,
  name,
  tentativas: item.tries,
  acertos: item.correct,
  pontos: item.points,
  erros: item.errors,
  indicePrecisao: `${Math.round(item.precision * 100)}%`,
  evolucao: item.evolution
    ? {
        valor: `${item.evolution.value > 0 ? "+" : ""}${Math.round(item.evolution.value * 100)}%`,
        status: item.evolution.status,
      }
    : {
        valor: "0%",
        status: "neutro",
      },
});

function Estatisticas() {
  const { action } = useParams<{ action?: string }>();
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<ActionType>(
    (action as ActionType) || "Saque"
  );
  const [stats, setStats] = useState<any>(null);

  const matchId = "ef9da76a-3aeb-456a-a194-d9317a044c1b";
  const playerId = "f328226d-f20d-4f42-876d-2df245f7d7b3";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/players/${playerId}/${matchId}/stats`);
        if (!response.ok) throw new Error("Erro ao buscar as estatísticas.");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchStats();
  }, [playerId, matchId]);

  const generalStats: StatRow[] = useMemo(() => {
    if (!stats?.generalStats) return [];
    return stats.generalStats.map((item: any, index: number) =>
      formatStatRow(item, index, actionLabelMap[item.action] || item.action)
    );
  }, [stats]);

  const actionStats: StatRow[] = useMemo(() => {
    if (!stats) return [];
    const key = actionKeyMap[activeAction];
    const actionData = stats[key] || [];
    return actionData.map((item: any, index: number) =>
      formatStatRow(item, index, item.setNumber)
    );
  }, [stats, activeAction]);

  return (
    <div className="flex flex-col align-center font-nunito">
      <Header />
      <Layout>
        <Title title="Estatísticas" showBackButton />

        <div className="mt-6">
          {/* Estatísticas Gerais */}
          <h3 className="font-semibold text-lg mb-4">Geral</h3>
          <div className="mb-8">
            <StatTable stats={generalStats} isActionTable={false} />
          </div>

          {/* Estatísticas por Ação */}
          <h3 className="font-semibold text-lg mb-4">Por ação</h3>
          <div className="mb-4">
            <div className="flex border-b">
              {(Object.keys(actionKeyMap) as ActionType[]).map((action) => (
                <button
                  key={action}
                  className={`px-4 py-2 font-semibold ${
                    activeAction === action
                      ? "text-[#00729B] border-b-2 border-[#00729B]"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <StatTable stats={actionStats} isActionTable />
          </div>

          {/* Botões */}
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
}

// Componente reutilizável para tabelas
const StatTable = ({ stats, isActionTable }: { stats: StatRow[]; isActionTable: boolean }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-[#CEF2FF] text-[#00729B]">
        <th className="p-3 text-left">{isActionTable ? "Set" : "Ação"}</th>
        <th className="p-3 text-center">Tentativas</th>
        <th className="p-3 text-center">Acertos</th>
        <th className="p-3 text-center">Pontos</th>
        <th className="p-3 text-center">Erros</th>
        <th className="p-3 text-center">Índice de precisão</th>
        {!isActionTable && <th className="p-3 text-center">Evolução (última partida)</th>}
      </tr>
    </thead>
    <tbody>
      {stats.map((stat, index) => (
        <tr key={stat.id} className={index % 2 === 0 ? "bg-[#E5F8FF]" : "bg-white"}>
          <td className="p-3 text-left">{stat.name}</td>
          <td className="p-3 text-center">{stat.tentativas}</td>
          <td className="p-3 text-center">{stat.acertos}</td>
          <td className="p-3 text-center">{stat.pontos}</td>
          <td className="p-3 text-center">{stat.erros}</td>
          <td className="p-3 text-center">
            {stat.indicePrecisao}
          </td>
          {!isActionTable && (
            <td className="p-3 text-center">
              {stat.evolucao && (
                <span className={`px-3 py-1 rounded-full ${getEvolucaoStyle(stat.evolucao.status)}`}>
                  {stat.evolucao.valor}
                </span>
              )}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Estatisticas;
