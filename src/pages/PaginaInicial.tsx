import Header from "../../src/components/header";
import LabTabs from "../../src/components/tabs";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";
import AbaJogadores from "../../src/components/aba_jogadores";
import AbaPartidas from "../../src/components/aba_partidas";

function PaginaInicial(props: PaginaInicialProps) {
	const { sigla, pais } = props;
	return (
		<div className="flex flex-col align-center">
			<Header />
			<Layout>
				<Title title="Página Inicial" />
				<div className="my-5">
					<div className="bg-[#00729B] py-[8px] px-[14px] w-fit rounded-[100px]">
						<p className="body-small font-bold text-white">Equipe Principal</p>
					</div>
					<p className="titulo">{sigla}</p>
					<p className="body-large opacity-80">{pais}</p>
				</div>
				<LabTabs
					titleOne="Jogadores"
					titleTwo="Partidas"
					contentOne={<AbaJogadores />}
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

export default PaginaInicial;
