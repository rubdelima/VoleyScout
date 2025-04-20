import Header from "../components/header";
import LabTabs from "../components/tabs";
import Title from "../components/title";
import Layout from "../components/layout";
import AbaJogadores from "../components/aba_jogadores";
import AbaPartidas from "../components/aba_partidas";
import { useEffect, useState } from "react";
import { Player } from "../components/table_jogadores";
import { Partida } from "../components/table_partidas";
import { useAuth } from "../context/AuthContext";
import BACKEND_URL from "../constants/Url";

function PaginaInicial(props: PaginaInicialProps) {
  const { sigla, pais } = props;
  const { team } = useAuth();  // Pegando o team do contexto AuthContext
  const [teamData, setTeamData] = useState<Team | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!team?.id) return;  // Certifica-se de que o team está disponível no contexto

        const response = await fetch(`${BACKEND_URL}teams/${team.id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar o time");
        }
        const data: Team = await response.json();
        setTeamData(data);  // Agora salvamos os dados do time em teamData
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchTeam();
  }, [team]);  // O efeito depende do team vindo do contexto

  return (
    <div className="flex flex-col align-center">
      <Header userName={team?.name} />
      <Layout>
        <Title title="Página Inicial" />
        <div className="my-5">
          <div className="bg-[#00729B] py-[8px] px-[14px] w-fit rounded-[100px]">
            <p className="body-small font-bold text-white">Equipe Principal</p>
          </div>
          <p className="titulo">{teamData?.abbreviation || '-'}</p>
          <p className="body-large opacity-80">{teamData?.name || '-'}</p>
        </div>
        <LabTabs
          titleOne="Jogadores"
          titleTwo="Partidas"
          contentOne={<AbaJogadores players={teamData?.players || []} />}
          contentTwo={<AbaPartidas matches={teamData?.matches || []} />}
        />
      </Layout>
    </div>
  );
}

interface PaginaInicialProps {
  sigla: string;
  pais: string;
}

interface Team {
  name: string;
  abbreviation: string;
  id: string;
  players: Player[];
  matches: Partida[];
}

export default PaginaInicial;
