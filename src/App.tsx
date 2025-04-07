import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PaginaInicial from "./pages/PaginaInicial";
import Equipes from "./pages/Equipes";
import MeuTime from "./pages/MeuTime";
import AdicionarJogador from "./pages/AdicionarJogador";
import NovaPartida from "./pages/NovaPartida";
import NovaAnalise from "./pages/NovaAnalise";
import Analise from "./pages/Analise";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import RegistrarTime from "./pages/RegistrarTime";
import Estatisticas from "./pages/Estatisticas";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Redirect root to /login */}
					<Route path="/" element={<Navigate to="/login" replace />} />

					{/* Public routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/registrar" element={<Registrar />} />

					{/* Protected routes */}
					<Route
						path="/equipes"
						element={<ProtectedRoute><Equipes /></ProtectedRoute>}
					/>
					<Route
						path="/meu-time"
						element={<ProtectedRoute><MeuTime /></ProtectedRoute>}
					/>
					<Route
						path="/registrar-time"
						element={<ProtectedRoute><RegistrarTime /></ProtectedRoute>}
					/>
					<Route
						path="/adicionar-jogador"
						element={<ProtectedRoute><AdicionarJogador /></ProtectedRoute>}
					/>
					<Route
						path="/nova-analise"
						element={<ProtectedRoute><NovaAnalise /></ProtectedRoute>}
					/>
					<Route
						path="/nova-partida"
						element={<ProtectedRoute><NovaPartida /></ProtectedRoute>}
					/>
					<Route
						path="/analise"
						element={<ProtectedRoute><Analise /></ProtectedRoute>}
					/>
					<Route
						path="/estatisticas"
						element={<ProtectedRoute><Estatisticas /></ProtectedRoute>}
					/>
					<Route
						path="/estatisticas/:action"
						element={<ProtectedRoute><Estatisticas /></ProtectedRoute>}
					/>
					<Route
						path="/pagina-inicial"
						element={<ProtectedRoute><PaginaInicial sigla="BRA" pais="Brasil" /></ProtectedRoute>}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
