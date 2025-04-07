import { useState } from 'react';
import volleyballImg from '../assets/login_volei.png';
import scoutAiLogo from '../assets/ScoutAí.png';
import BACKEND_URL from '../constants/Url';

function Registrar() {
	const [formData, setFormData] = useState({
		name: '',
		nickname: '',
		password: '',
		confirmPassword: ''
	});

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (formData.password !== formData.confirmPassword) {
			setError('As senhas não coincidem.');
			return;
		}

		try {
			const response = await fetch(`${BACKEND_URL}sign_up`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nickname: formData.nickname,
					password: formData.password,
					name: formData.name
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.detail?.[0]?.msg || 'Erro no cadastro');
			}

			const result = await response.json();
			setSuccess(`Cadastro realizado! ID: ${result.id}`);
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
					<div className="flex flex-col items-center mb-6">
						<img src={scoutAiLogo} alt="ScoutAí Logo" className="h-10 mb-6" />
						<h2 className="text-xl font-semibold text-cyan-800">Crie sua conta</h2>
					</div>

					<form className="space-y-3" onSubmit={handleSubmit}>
						<div>
							<label className="text-sm text-gray-700">Nome completo</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700">E-mail (nickname)</label>
							<input
								type="text"
								name="nickname"
								value={formData.nickname}
								onChange={handleChange}
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700">Senha</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700">Confirmar senha</label>
							<input
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
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
