import volleyballImg from '../assets/login_volei.png';
import scoutAiLogo from '../assets/ScoutAí.png'; // Novo logo

function Login() {
	return (
		<div className="flex h-screen">
			{/* Lado esquerdo - imagem */}
			<div className="w-1/2 h-screen">
				<img
					src={volleyballImg}
					alt="Login"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Lado direito - formulário */}
			<div className="w-1/2 h-screen flex items-center justify-center">
				<div className="w-full max-w-sm px-8">
					{/* Logo com imagem */}
					<div className="flex flex-col items-center mb-6">
						<img src={scoutAiLogo} alt="ScoutAí Logo" className="h-10" />
						<h2 className="text-lg font-semibold text-cyan-800 mt-6">
							Login
						</h2>
					</div>

					<form className="space-y-4">
						<div>
							<label className="text-sm text-gray-700">E-mail</label>
							<input
								type="email"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700">Senha</label>
							<input
								type="password"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-cyan-700 text-white py-2 rounded-md hover:bg-cyan-800 transition"
						>
							Login
						</button>
					</form>

					<p className="text-sm text-center text-gray-600 mt-4">
						Não tem uma conta?{' '}
						<a href="#" className="text-cyan-700 hover:underline">
							Cadastre-se
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
