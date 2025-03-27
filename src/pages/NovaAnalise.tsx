import Header from "../../src/components/header";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";

function NovaAnalise(props: NovaAnaliseProps) {
	//const {} = props;
	return (
		<div className="flex flex-col align-center">
			<Header />
			<Layout>
				<Title title="Nova análise" showBackButton />
			</Layout>
		</div>
	);
}
interface NovaAnaliseProps {
	// sigla: string;
	// pais: string;
}

export default NovaAnalise;
