import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicial from "./pages/PaginaInicial";
import Equipes from "./pages/Equipes";
import MeuTime from "./pages/MeuTime";
import AdicionarJogador from "./pages/AdicionarJogador";
import NovaPartida from "./pages/NovaPartida";
import NovaAnalise from "./pages/NovaAnalise";
import Analise from "./pages/Analise";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PaginaInicial sigla="BRA" pais="Brasil" />} />
				<Route path="/equipes" element={<Equipes />} />
				<Route path="/meu-time" element={<MeuTime />} />

				<Route path="/adicionar-jogador" element={<AdicionarJogador />} />
				<Route path="/nova-analise" element={<NovaAnalise />} />
				<Route path="/nova-partida" element={<NovaPartida />} />
				<Route path="/analise" element={<Analise />} />
			</Routes>
		</Router>
	);
}

export default App;
