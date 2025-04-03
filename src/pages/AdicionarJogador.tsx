import Header from "../../src/components/header";
import Title from "../../src/components/title";
import Layout from "../../src/components/layout";
import Subtitle from "../../src/components/subtitle";
import { useState } from "react";
import IndicadorObrigatorio from "../components/indicador_obrigatorio";
import BotaoCallback, { BotaoCallbackStyle } from "../components/botao_callback";
import { apiService } from "../services/fest-volei-service";
import { Jogador, Posicao } from "../constants/Jogador";

const LABEL_CLASSNAMES = "text-zerondary font-semibold block pb-1";
const INPUT_CLASSNAMES = "border-2 p-2.5 w-full rounded-md border-zerondary focus:outline-none focus:ring-2 focus:ring-primary";

function AdicionarJogador() {
	const [formData, setFormData] = useState<Jogador>({
		name: "",
		nickname: "",
		position: Posicao.Ponteiro,
		number: "",
		height: 0,
		birthdate: "",
		isCaptain: false,
		team: ""
	});

	const setFormDataField = <K extends keyof Jogador>(field: { name_field: K, value: Jogador[K] }) => {
		const { name_field, value } = field;
		setFormData({
			...formData,
			[name_field]: value
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const [day, month, year] = formData.birthdate.split('/');
		const formattedDate = `${year}-${month}-${day}T00:00:00`;	
		const jogadorFormatado = {
			...formData,
			birthdate: formattedDate
		};	
		apiService.adicionarJogador(jogadorFormatado).then(() => {
			alert("Jogador salvo com sucesso!")
			setFormData({
				name: "",
				nickname: "",
				position: Posicao.Ponteiro,
				number: "",
				height: 0,
				birthdate: "",
				isCaptain: false,
				team: ""
			});
		}).catch(() => 
			alert("Ocorreu um erro ao tentar salvar o jogador!")
		);
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
								value={formData.name}
								onChange={(e) => setFormDataField({ name_field: 'name', value: e.target.value })}
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
								value={formData.nickname}
								onChange={(e) => setFormDataField({ name_field: 'nickname', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								placeholder="Digite"
							/>
						</div>
						<div className="col-span-1">
							<label htmlFor="posicao" className={LABEL_CLASSNAMES}>Posição <IndicadorObrigatorio obrigatorio={true} /></label>
							<select
								id="posicao"
								name="posicao"
								value={formData.position}
								onChange={(e) => setFormDataField({ name_field: 'position', value: e.target.value as Posicao })}
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
								value={formData.height}
								onChange={(e) => {
									const value = e.target.value;
									const numericValue = parseInt(value, 10);
									if (!isNaN(numericValue) && numericValue >= 0) {
										setFormDataField({ name_field: 'height', value: numericValue });
									} else if (value === "") {
										setFormDataField({ name_field: 'height', value: 0 });
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
								value={formData.number}
								onChange={(e) => setFormDataField({ name_field: 'number', value: e.target.value })}
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
								value={formData.birthdate}
								onChange={(e) => setFormDataField({ name_field: 'birthdate', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								required
							/>
						</div>
						<div className="col-span-1">
							<label htmlFor="team" className={LABEL_CLASSNAMES}>Time <IndicadorObrigatorio obrigatorio={true} /></label>
							<input
								type="text"
								id="team"
								name="team"
								value={formData.team}
								onChange={(e) => setFormDataField({ name_field: 'team', value: e.target.value })}
								className={INPUT_CLASSNAMES}
								required
							/>
						</div>
						<div className="col-span-1 md:col-span-4 pt-4">
							<fieldset>
								<legend className="font-semibold block pb-1">Esse jogador é capitão?</legend>
									<div className="flex items-center mt-2 mb-4">
										<input
											type="radio"
											id="capitao-sim"
											name="capitao"
											value="true"
											checked={formData.isCaptain === true}
											onChange={() => setFormDataField({ name_field: 'isCaptain', value: true })}
											className="mr-2 w-6 h-6 text-primary bg-white border-disabled focus:ring-primary"
										/>
										<label htmlFor="capitao-sim">Sim</label>
									</div>
									<div className="flex items-center mt-2 mb-4">
										<input
											type="radio"
											id="capitao-nao"
											name="capitao"
											value="false"
											checked={formData.isCaptain === false}
											onChange={() => setFormDataField({ name_field: 'isCaptain', value: false })}
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
					<BotaoCallback className="w-44" style={BotaoCallbackStyle.Filled} type="submit">
						Confirmar
					</BotaoCallback>
					</div>
				</form>
			</Layout>
		</div>
	);
}

export default AdicionarJogador;
