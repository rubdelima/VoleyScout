import volleyballImg from '../assets/login_volei.png';

function RegistrarTime() {
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
					<p className="text-sm text-center text-gray-700 mb-1">
						Quase lá! Só falta mais um passo para <br />
						começar suas análises
					</p>

					<h2 className="text-xl font-semibold text-center text-cyan-800 mb-6">
						Registre seu time principal
					</h2>

					<form className="space-y-4">
						<div>
							<label className="text-sm text-gray-700">Nome do time</label>
							<input
								type="text"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700">Sigla</label>
							<input
								type="text"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-cyan-700 text-white py-2 rounded-md hover:bg-cyan-800 transition"
						>
							Registrar
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default RegistrarTime;
