import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import volleyballImg from '../assets/login_volei.png';

function RegistrarTime() {
	const [formData, setFormData] = useState({ name: '', abbreviation: '' });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { user, teams, setTeams } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		try {
			const response = await fetch('http://127.0.0.1:8000/teams', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.detail?.[0]?.msg || 'Erro ao registrar time');
			}

			const result = await response.json();
			setSuccess(`Time registrado com sucesso! ID: ${result.id}`);

			// Adiciona o time ao contexto
			setTeams([...teams, result]);

		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Erro desconhecido.');
			}
		}
	};

	return (
		<div className="flex h-screen">
			{/* Lado esquerdo - imagem */}
			<div className="w-1/2 h-screen">
				<img
					src={volleyballImg}
					alt="Vôlei"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Lado direito - formulário */}
			<div className="w-1/2 h-screen flex items-center justify-center">
				<div className="w-full max-w-sm px-8">
					<p className="text-sm text-center text-gray-700 mb-1">
						Quase lá! Só falta mais um passo para <br />
						começar suas análises
					</p>

					<h2 className="text-xl font-semibold text-center text-cyan-800 mb-6">
						Registre seu time principal
					</h2>

					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label className="text-sm text-gray-700">Nome do time</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700">Sigla</label>
							<input
								type="text"
								name="abbreviation"
								value={formData.abbreviation}
								onChange={handleChange}
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>

						{error && <p className="text-red-500 text-sm text-center">{error}</p>}
						{success && <p className="text-green-600 text-sm text-center">{success}</p>}

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
