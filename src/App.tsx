import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicial from "./pages/PaginaInicial";
import NovaPartida from "./pages/NovaPartida";
import NovaAnalise from "./pages/NovaAnalise";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PaginaInicial />} />
				<Route path="/nova-partida" element={<NovaPartida />} />
				<Route path="/nova-analise" element={<NovaAnalise />} />
			</Routes>
		</Router>
	);
}

export default App;
