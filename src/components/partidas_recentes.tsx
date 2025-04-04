import Subtitle from "../components/subtitle";

export interface Partida {
	id: number;
	equipe: string;
	sigla_equipe: string;
	adversario: string;
	sigla_adversario: string;
	n_sets: number;
	resultado: string;
	data: string;
	situacao: string;
	jogadores_analisados: number;
}

function formatarResultado(resultado: string, situacao: string) {
	// Divide o resultado em duas partes (esquerda e direita)
	const [esquerda, direita] = resultado.split("x");

	// Verifica a situação para determinar qual parte deve ser destacada
	if (situacao === "Vitória") {
		return (
			<>
				<p className="flex h2-resultado gap-2">
					<p className="h2-resultado-vitoria">{esquerda}</p> x
					<p className="h2-resultado-derrota">{direita}</p>
				</p>
			</>
		);
	} else if (situacao === "Derrota") {
		return (
			<>
				<p className="flex h2-resultado gap-2">
					<p className="h2-resultado-derrota">{esquerda}</p> x
					<p className="h2-resultado-vitoria">{direita}</p>
				</p>
			</>
		);
	}

	// Caso padrão (não deve acontecer, já que não há empates)
	return resultado;
}

function PartidasRecentes(props: PartidasRecentesProps) {
	const { item1, item2, item3 } = props;

	return (
		<div>
			<Subtitle title="Partidas recentes" />
			<div className="grid grid-cols-3 gap-10">
				<div className="bg-[#CEF2FF] p-10 gap-10 flex justify-around rounded-[15px]">
					<div className="flex flex-col">
						<p className="h3-bold text-[#00729B]">{item1?.sigla_equipe || ''}</p>
						<p className="body-medium text-[#00729B]">{item1?.equipe || ''}</p>
					</div>
					<div>{formatarResultado(item1?.resultado || '', item1?.situacao || '')}</div>
					<div className="flex flex-col items-end">
						<p className="h3-bold text-[#00729B]">{item1?.sigla_adversario || ''}</p>
						<p className="body-medium text-[#00729B]">{item1?.adversario || ''}</p>
					</div>
				</div>
				<div className="bg-[#CEF2FF] p-10 gap-10 flex justify-around rounded-[15px]">
					<div className="flex flex-col">
						<p className="h3-bold text-[#00729B]">{item2?.sigla_equipe || ''}</p>
						<p className="body-medium text-[#00729B]">{item2?.equipe || ''}</p>
					</div>
					<div>{formatarResultado(item2?.resultado || '', item2?.situacao || '')}</div>
					<div className="flex flex-col items-end">
						<p className="h3-bold text-[#00729B]">{item2?.sigla_adversario || ''}</p>
						<p className="body-medium text-[#00729B]">{item2?.adversario || ''}</p>
					</div>
				</div>
				<div className="bg-[#CEF2FF] p-10 gap-10 flex justify-around rounded-[15px]">
					<div className="flex flex-col">
						<p className="h3-bold text-[#00729B]">{item3?.sigla_equipe || ''}</p>
						<p className="body-medium text-[#00729B]">{item3?.equipe || ''}</p>
					</div>
					<div>{formatarResultado(item3?.resultado || '', item3?.situacao || '')}</div>
					<div className="flex flex-col items-end">
						<p className="h3-bold text-[#00729B]">{item3?.sigla_adversario || ''}</p>
						<p className="body-medium text-[#00729B]">{item3?.adversario || ''}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

interface PartidasRecentesProps {
	item1: Partida;
	item2: Partida;
	item3: Partida;
}

export default PartidasRecentes;
