import IconButton from "@mui/material/IconButton";
import analisador from "../assets/analisador.svg";

function Analisador() {
	return (
		<div>
			<IconButton>
				<img src={analisador} alt="" className="w-[25px] h-[25px]" />
			</IconButton>
		</div>
	);
}

export default Analisador;
