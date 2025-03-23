import Header from "../../src/components/header";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";

function AdicionarJogador(props: AdicionarJogadorProps) {
	//const {} = props;
	return (
		<div className="flex flex-col align-center">
			<Header />
			<Layout>
				<Title title="Adicionar jogador no time" />
			</Layout>
		</div>
	);
}
interface AdicionarJogadorProps {
	// sigla: string;
	// pais: string;
}

export default AdicionarJogador;
