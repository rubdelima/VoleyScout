import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicial from "./pages/PaginaInicial";
import Equipes from "./pages/Equipes";
import MeuTime from "./pages/MeuTime";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PaginaInicial sigla="BRA" pais="Brasil" />} />
				<Route path="/equipes" element={<Equipes />} />
				<Route path="/meu-time" element={<MeuTime />} />
			</Routes>
		</Router>
	);
}

export default App;
