import JogadoresHeader from "../../src/components/jogadores_header";
import Table from "../../src/components/table";

const players = [
	{ id: 1, name: "Jogador 1" },
	{ id: 2, name: "Jogador 2" },
	{ id: 3, name: "Jogador 3" },
	{ id: 4, name: "Jogador 4" },
	{ id: 5, name: "Jogador 5" },
	{ id: 6, name: "Jogador 6" },
	{ id: 7, name: "Jogador 7" },
	{ id: 8, name: "Jogador 8" },
	{ id: 9, name: "Jogador 9" },
	{ id: 10, name: "Jogador 10" },
	// Adicione mais jogadores conforme necessário
];

function AbaJogadores() {
	return (
		<div>
			<JogadoresHeader
				texto="Total de jogadores"
				numero={10}
				botao="Adicionar jogador"
			/>
			<Table items={players} />
		</div>
	);
}

export default AbaJogadores;
