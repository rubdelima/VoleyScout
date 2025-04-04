import Header from "../../src/components/header";
import LabTabs from "../../src/components/tabs";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";
import AbaJogadores from "../../src/components/aba_jogadores";
import AbaPartidas from "../../src/components/aba_partidas";
import { useEffect, useState } from "react";
import {Player}  from "../../src/components/table_jogadores";
import { Partida } from "../components/table_partidas";

function PaginaInicial(props: PaginaInicialProps) {
	
	const { sigla, pais } = props;
	const [team, setTeam] = useState<Team | null>(null);
	const teamId = "a21cb5a4-3a30-42fe-82e9-320307b09122"; // Tem que ver se tem como pegar pelo contexto, do usuário. 
	useEffect(() => {
		const fetchTeam = async () => {
			try {
				const response = await fetch(`http://127.0.0.1:8000/home/${teamId}`);
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
	}, [teamId]);
	return (
		<div className="flex flex-col align-center">
			<Header />
			<Layout>
				<Title title="Página Inicial" />
				<div className="my-5">
					<div className="bg-[#00729B] py-[8px] px-[14px] w-fit rounded-[100px]">
						<p className="body-small font-bold text-white">Equipe Principal</p>
					</div>
					<p className="titulo">{team?.abbreviation}</p>
					<p className="body-large opacity-80">{team?.name}</p>
				</div>
				<LabTabs
					titleOne="Jogadores"
					titleTwo="Partidas"
					contentOne={<AbaJogadores players={team?.players || []} />}
					contentTwo={<AbaPartidas />}
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
