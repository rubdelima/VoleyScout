import Header from "../components/header";
import Title from "../components/title";
import Layout from "../components/layout";
import SubHeader from "../components/sub_header";
import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React from "react";
import BotaoCallback, {
	BotaoCallbackStyle,
} from "../components/botao_callback";
import PainelAcao, { PainelAcaoProps } from "../components/painel_acao";

function Analise(props: AnaliseProps) {
	const RADIO_LABEL_CLASSNAMES = "font-semibold block pb-1";
	const RADIO_CONTAINER_CLASSNAMES = "flex items-center mt-2 mb-4";
	const RADIO_INPUT_CLASSNAMES = "mr-2 w-6 h-6 text-primary bg-white border-disabled focus:ring-primary";

	const SETS = ["1", "2", "3", "4", "5"] as const;

	const ACTION_PANELS: PainelAcaoProps[] = [
		{
			title: "Saque",
			counters: [
				{ label: "Acerto", value: 0 },
				{ label: "Ponto", value: 0 },
				{ label: "Erro", value: 0 },
			]
		},
		{
			title: "Ataque",
			counters: [
				{ label: "Acerto", value: 0 },
				{ label: "Ponto", value: 0 },
				{ label: "Erro", value: 0 },
			]
		},
		{
			title: "Recepção",
			counters: [
				{ label: "Passe A", value: 0 },
				{ label: "Passe B", value: 0 },
				{ label: "Passe C", value: 0 },
				{ label: "Erro", value: 0 },
			]
		},
		{
			title: "Bloqueio",
			counters: [
				{ label: "Acerto", value: 0 },
				{ label: "Amortecido", value: 0 },
				{ label: "Explorado (erro)", value: 0 },
			]
		},
		{
			title: "Levantamento",
			counters: [
				{ label: "Levantamento A", value: 0 },
				{ label: "Levantamento B", value: 0 },
				{ label: "Levantamento C", value: 0 },
				{ label: "Levantamento D", value: 0 },
				{ label: "Erro", value: 0 },
			]
		}
	]

	const [selectedSet, setSelectedSet] = React.useState<(typeof SETS)[number]>(
		SETS[0]
	);

	const handleChange = (
		event: React.SyntheticEvent,
		newValue: (typeof SETS)[number]
	) => {
		setSelectedSet(newValue);
	};

	return (
		<div className="flex flex-col align-center font-nunito">
			<Header />
			<Layout>
				<Title title="Análise" />

				<SubHeader>Sets</SubHeader>

				<Box sx={{ width: "100%", typography: "body1" }}>
					<TabContext value={selectedSet}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<TabList onChange={handleChange}>
								{SETS.map((set) => (
									<Tab
										key={set}
										className="body-large-bold"
										sx={{ textTransform: "none" }}
										label={`Set ${set}`}
										value={set}
									/>
								))}
							</TabList>
						</Box>
					</TabContext>
				</Box>

				<div className="py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
					<div className="col-span-1">
						<fieldset>
							<legend className={RADIO_LABEL_CLASSNAMES}>Jogador participou do set?</legend>
							<div className={RADIO_CONTAINER_CLASSNAMES}>
								<input
									type="radio"
									id="participante-set-sim"
									name="participante-set"
									value="true"
									className={RADIO_INPUT_CLASSNAMES}
								/>
								<label htmlFor="participante-set-sim">Sim</label>
							</div>
							<div className={RADIO_CONTAINER_CLASSNAMES}>
								<input
									type="radio"
									id="participante-set-nao"
									name="participante-set"
									value="false"
									className={RADIO_INPUT_CLASSNAMES}
								/>
								<label htmlFor="participante-set-nao">Não</label>
							</div>
						</fieldset>
					</div>

					<div className="col-span-1">
						<fieldset>
							<legend className={RADIO_LABEL_CLASSNAMES}>Houve substituição?</legend>
							<div className={RADIO_CONTAINER_CLASSNAMES}>
								<input
									type="radio"
									id="substituicao-sim"
									name="substituicao"
									value="true"
									className={RADIO_INPUT_CLASSNAMES}
								/>
								<label htmlFor="substituicao-sim">Sim</label>
							</div>
							<div className={RADIO_CONTAINER_CLASSNAMES}>
								<input
									type="radio"
									id="substituicao-nao"
									name="substituicao"
									value="false"
									className={RADIO_INPUT_CLASSNAMES}
								/>
								<label htmlFor="substituicao-nao">Não</label>
							</div>
						</fieldset>
					</div>

					<div className="col-span-1 flex flex-col justify-end">
						<fieldset>
							<div className={RADIO_CONTAINER_CLASSNAMES}>
								<input
									type="radio"
									id="acao-jogador-entrou"
									name="acao-jogador"
									value="true"
									className={RADIO_INPUT_CLASSNAMES}
								/>
								<label htmlFor="acao-jogador-entrou">Jogador entrou</label>
							</div>
							<div className={RADIO_CONTAINER_CLASSNAMES}>
								<input
									type="radio"
									id="acao-jogador-saiu"
									name="acao-jogador"
									value="false"
									className={RADIO_INPUT_CLASSNAMES}
								/>
								<label htmlFor="acao-jogador-saiu">Jogador saiu</label>
							</div>
						</fieldset>
					</div>

				</div>

				<SubHeader>Ações</SubHeader>

				<div className="flex flex-col gap-2 w-full mb-6">
					{ACTION_PANELS.map((panel) => (
						<PainelAcao
							key={panel.title}
							title={panel.title}
							counters={panel.counters}
						/>
					))}
				</div>

				<div className="flex flex-row gap-2 items-center justify-end">
					<BotaoCallback
						style={BotaoCallbackStyle.Outline}
						className="w-44"
						onClick={() => {
							// TODO: Perform deletion
						}}
					>
						Excluir
					</BotaoCallback>
					<BotaoCallback
						className="w-44"
						style={BotaoCallbackStyle.Filled}
						onClick={() => {
							// TODO: Perform finish action
						}}
					>
						Finalizar
					</BotaoCallback>
				</div>
			</Layout>
		</div>
	);
}
interface AnaliseProps { }

export default Analise;
