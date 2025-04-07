import Header from "../../src/components/header";
import LabTabs from "../../src/components/tabs";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";
import AbaJogadores from "../../src/components/aba_jogadores";
import AbaPartidas from "../../src/components/aba_partidas";
import { useEffect, useState } from "react";
import { Player } from "../../src/components/table_jogadores";
import { Partida } from "../components/table_partidas";
import { useAuth } from "../context/AuthContext";

function PaginaInicial(props: PaginaInicialProps) {
  const { sigla, pais } = props;
  const [team, setTeam] = useState<Team | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(`http://127.0.0.1:8000/teams/${user.id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar o time");
        }
        const data: Team = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };
    fetchTeam();
  }, [user]);

  return (
    <div className="flex flex-col align-center">
      <Header userName={user?.name} />
      <Layout>
        <Title title="Página Inicial" />
        <div className="my-5">
          <div className="bg-[#00729B] py-[8px] px-[14px] w-fit rounded-[100px]">
            <p className="body-small font-bold text-white">Equipe Principal</p>
          </div>
          <p className="titulo">{team?.abbreviation || '-'}</p>
          <p className="body-large opacity-80">{team?.name || '-'}</p>
        </div>
        <LabTabs
          titleOne="Jogadores"
          titleTwo="Partidas"
          contentOne={<AbaJogadores players={team?.players || []} />}
          contentTwo={<AbaPartidas matches={team?.matches || []} />}
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