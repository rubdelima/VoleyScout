import volleyballImg from '../assets/login_volei.png';

function Registrar() {
	return (
		<div className="flex h-screen">
			{/* Left Side - Image */}
			<div className="w-1/2 h-screen">
				<img
					src={volleyballImg}
					alt="Vôlei"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Right Side - Form */}
			<div className="w-1/2 h-screen flex items-center justify-center">
				<div className="w-full max-w-sm px-8">
					<h2 className="text-2xl font-semibold text-center text-cyan-800 mb-6">
						Crie sua conta
					</h2>

					<form className="space-y-4">
						<div>
							<label className="text-sm text-gray-700">Nome completo</label>
							<input
								type="text"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
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
						<div>
							<label className="text-sm text-gray-700">Confirmar senha</label>
							<input
								type="password"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-cyan-700 text-white py-2 rounded-md hover:bg-cyan-800 transition"
						>
							Cadastrar
						</button>
					</form>

					<p className="text-sm text-center text-gray-600 mt-4">
						Já tem uma conta?{' '}
						<a href="/login" className="text-cyan-700 hover:underline">
							Login
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Registrar;
