import Header from "../../src/components/header";
import LabTabs from "../../src/components/tabs";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";

function PaginaInicial() {
	return (
		<div className="flex flex-col align-center">
			<Header />
			<Layout>
				<Title title="Página Inicial" />
				<div className="my-5">
					<div className="bg-[#00729B] py-[8px] px-[14px] w-fit rounded-[100px]">
						<p className="body-small font-bold text-white">Equipe Principal</p>
					</div>
					<p className="titulo">BRA</p>
					<p className="body-large opacity-80">Brasil</p>
				</div>
				<LabTabs
					titleOne="Jogadores"
					titleTwo="Partidas"
					contentOne={"1"}
					contentTwo={"2"}
				/>
			</Layout>
		</div>
	);
}

export default PaginaInicial;
