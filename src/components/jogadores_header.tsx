function JogadoresHeader(props: JogadoresHeaderProps) {
	const { texto, numero, botao } = props;

	return (
		<div className="flex justify-between">
			<div className="flex flex-col gap-3">
				<p className="body-large opacity-80">{texto}</p>
				<h2 className="text-[#29A3CF]">{numero}</h2>
			</div>
			<div className="flex justify-center items-center h-[50px] bg-[#00729B] px-[16px] rounded-[46px]">
				<p className="body-medium-bold text-white">+ {botao}</p>
			</div>
		</div>
	);
}

interface JogadoresHeaderProps {
	texto: string;
	numero: number;
	botao: string;
}

export default JogadoresHeader;
