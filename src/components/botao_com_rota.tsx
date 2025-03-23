import { Link } from "react-router-dom";

function BotaoComRota(props: BotaoComRotaProps) {
	const { texto, route, size } = props;

	return (
		<div>
			<Link
				to={route}
				className={`flex justify-center items-center bg-[#00729B] cursor-pointer px-[16px] rounded-[46px] ${
					size === "medium" ? "h-[50px]" : "h-[30px]"
				}`}
			>
				<p
					className={`text-white ${
						size === "medium" ? "body-medium-bold" : "body-small-bold"
					}`}
				>
					+ {texto}
				</p>
			</Link>
		</div>
	);
}

interface BotaoComRotaProps {
	texto: string;
	route: string;
	size: "small" | "medium";
}

export default BotaoComRota;
