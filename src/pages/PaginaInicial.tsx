import Header from "../../src/components/header";
import LabTabs from "../../src/components/tabs";

function PaginaInicial() {
	return (
		<div>
			<Header />
			<LabTabs
				titleOne="Jogadores"
				titleTwo="Partidas"
				contentOne={"1"}
				contentTwo={"2"}
			/>
		</div>
	);
}

export default PaginaInicial;
