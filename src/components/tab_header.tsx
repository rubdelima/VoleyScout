import BotaoComRota from "./botao_com_rota";

function TabHeader(props: TabHeaderProps) {
	const { texto, numero, botao, route } = props;

	return (
		<div className="flex justify-between">
			<div className="flex flex-col gap-3">
				<p className="body-large opacity-80">{texto}</p>
				<h2 className="text-[#29A3CF]">{numero}</h2>
			</div>
			<BotaoComRota texto={botao} route={route} size="medium" />
		</div>
	);
}

interface TabHeaderProps {
	texto: string;
	numero: number;
	botao: string;
	route: string;
}

export default TabHeader;
