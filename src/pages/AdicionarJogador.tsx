import Header from "../../src/components/header";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";
import Subtitle from "../../src/components/subtitle";
import { useState } from "react";
import IndicadorObrigatorio from "../components/indicador_obrigatorio";
import BotaoCallback, { BotaoCallbackStyle } from "../components/botao_callback";

export interface Jogador {
	nome: string;
	apelido: string;
	posicao: Posicao;
	numero: string;
	altura_cm: number;
	nascimento: string;
	capitao: boolean;
}

export enum Posicao {
	Ponteiro = "Ponteiro",
	Oposto = "Oposto",
	Central = "Central",
	Levantador = "Levantador",
	Líbero = "Líbero"
}

const LABEL_CLASSNAMES = "text-zerondary font-semibold block pb-1";
const INPUT_CLASSNAMES = "border-2 p-2.5 w-full rounded-md border-zerondary focus:outline-none focus:ring-2 focus:ring-primary";

function AdicionarJogador() {
	const [formData, setFormData] = useState<Jogador>({
		nome: "",
		apelido: "",
		posicao: Posicao.Ponteiro,
		numero: "",
		altura_cm: 0,
		nascimento: "",
		capitao: false
	});

	const setFormDataField = <K extends keyof Jogador>(field: { name: K, value: Jogador[K] }) => {
		const { name, value } = field;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: Perform form submission logic here
		console.log(formData);
	};

	return (
		<div className="flex flex-col align-center font-nunito">
			<Header />
			<Layout>
				<Title title="Adicionar jogador no time" />
				<form className="mt-6" onSubmit={handleSubmit}>
					<Subtitle title="Informações do jogador" />

					<div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="col-span-1 md:col-span-3">
							<label htmlFor="nome-completo" className={LABEL_CLASSNAMES}>Nome completo <IndicadorObrigatorio obrigatorio={true} /></label>
							<input
								type="text"
								id="nome-completo"
								name="nome-completo"
								value={formData.nome}
								onChange={(e) => setFormDataField({ name: 'nome', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								required
								placeholder="Digite"
							/>
						</div>
						<div className="col-span-1">
							<label htmlFor="apelido" className={LABEL_CLASSNAMES}>Apelido <IndicadorObrigatorio obrigatorio={false} /></label>
							<input
								type="text"
								id="apelido"
								name="apelido"
								value={formData.apelido}
								onChange={(e) => setFormDataField({ name: 'apelido', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								placeholder="Digite"
							/>
						</div>
						<div className="col-span-1">
							<label htmlFor="posicao" className={LABEL_CLASSNAMES}>Posição <IndicadorObrigatorio obrigatorio={true} /></label>
							<select
								id="posicao"
								name="posicao"
								value={formData.posicao}
								onChange={(e) => setFormDataField({ name: 'posicao', value: e.target.value as Posicao })}
								className={INPUT_CLASSNAMES}
								required
							>
								{Object.values(Posicao).map((posicao) => (
									<option key={posicao} value={posicao}>
										{posicao}
									</option>
								))}
							</select>
						</div>
						<div className="col-span-1">
							<label htmlFor="altura-cm" className={LABEL_CLASSNAMES}>Altura (cm) <IndicadorObrigatorio obrigatorio={true} /></label>
							<input
								type="text"
								id="altura-cm"
								name="altura-cm"
								value={formData.altura_cm}
								onChange={(e) => {
									const value = e.target.value;
									const numericValue = parseInt(value, 10);
									if (!isNaN(numericValue) && numericValue >= 0) {
										setFormDataField({ name: 'altura_cm', value: numericValue });
									} else if (value === "") {
										setFormDataField({ name: 'altura_cm', value: 0 });
									}
								}}
								className={INPUT_CLASSNAMES}
								required
								placeholder="Digite"
							/>
						</div>
						<div className="col-span-1">
							<label htmlFor="numero" className={LABEL_CLASSNAMES}>Número <IndicadorObrigatorio obrigatorio={true} /></label>
							<input
								type="text"
								id="numero"
								name="numero"
								value={formData.numero}
								onChange={(e) => setFormDataField({ name: 'numero', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								required
								placeholder="Digite"
							/>
						</div>
						<div className="col-span-1">
							<label htmlFor="nascimento" className={LABEL_CLASSNAMES}>Nascimento <IndicadorObrigatorio obrigatorio={true} /></label>
							<input
								type="text"
								id="nascimento"
								name="nascimento"
								value={formData.nascimento}
								onChange={(e) => setFormDataField({ name: 'nascimento', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								required
								placeholder="dd/mm/aaaa"
							/>
						</div>
						<div className="col-span-1 md:col-span-4 pt-4">
							<fieldset>
								<legend className="font-semibold block pb-1">Esse jogador é capitão?</legend>
									<div className="flex items-center mt-2">
										<input
											type="radio"
											id="capitao-sim"
											name="capitao"
											value="true"
											checked={formData.capitao === true}
											onChange={() => setFormDataField({ name: 'capitao', value: true })}
											className="mr-2 w-6 h-6 text-primary bg-white border-disabled focus:ring-primary"
										/>
										<label htmlFor="capitao-sim">Sim</label>
									</div>
									<div className="flex items-center mt-2">
										<input
											type="radio"
											id="capitao-nao"
											name="capitao"
											value="false"
											checked={formData.capitao === false}
											onChange={() => setFormDataField({ name: 'capitao', value: false })}
											className="mr-2 w-6 h-6 text-primary bg-white border-disabled focus:ring-primary"
										/>
										<label htmlFor="capitao-nao">Não</label>
									</div>
							</fieldset>
						</div>
					</div>
					<div className="flex flex-row gap-2 items-center justify-end">
					<BotaoCallback style={BotaoCallbackStyle.Outline} className="w-44" onClick={() => {
						// TODO: Perform form canceling here
					}}>
						Cancelar
					</BotaoCallback>
					<BotaoCallback className="w-44" style={BotaoCallbackStyle.Filled}>
						Confirmar
					</BotaoCallback>
					</div>
				</form>
			</Layout>
		</div>
	);
}

export default AdicionarJogador;
