import Header from "../components/header";
import Title from "../components/title";
import Layout from "../components/layout";

function NovaPartida(props: NovaPartidaProps) {
	//const {} = props;
	return (
		<div className="flex flex-col align-center">
			<Header />
			<Layout>
				<Title title="Nova partida" />
			</Layout>
		</div>
	);
}
interface NovaPartidaProps {
	// sigla: string;
	// pais: string;
}

export default NovaPartida;
