import React, { useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { ReactComponent as CustomArrow } from "../assets/seta.svg";
import BotaoComRota from "./botao_com_rota";
import Subtitle from "../components/subtitle";

interface Player {
	id: number;
	nome: string;
	apelido: string;
	posicao: string;
	numero: number;
	altura: number;
	nascimento: string;
	analises: number;
	capitao: boolean;
}

interface TableJogadoresProps {
	items: Player[];
	title: string;
}

function TableJogadores(props: TableJogadoresProps) {
	const { items, title } = props;
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);
	const [openItemsPerPage, setOpenItemsPerPage] = useState(false);
	const [openPageSelect, setOpenPageSelect] = useState(false);

	// Calcula o índice inicial e final dos itens a serem exibidos na página atual
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

	// Calcula o número total de páginas
	const totalPages = Math.ceil(items.length / itemsPerPage);

	// Texto para exibir o intervalo de itens
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, items.length);
	const totalItems = items.length;
	const itemsDisplayText = `${startItem}-${endItem} de ${totalItems} itens`;

	// Função para mudar a quantidade de itens por página
	const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
		setItemsPerPage(Number(event.target.value));
		setCurrentPage(1); // Resetar para a primeira página ao mudar a quantidade de itens por página
	};

	// Função para mudar a página
	const handlePageChange = (event: SelectChangeEvent<number>) => {
		setCurrentPage(Number(event.target.value));
	};

	// Opções de páginas para o select
	const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div>
			<Subtitle title={title} />
			<table>
				<thead>
					<tr>
						<th>
							<p>Nome completo</p>
						</th>
						<th>Apelido</th>
						<th>Posição</th>
						<th>Número</th>
						<th>Altura</th>
						<th>Nascimento</th>
						<th>Nº de análises</th>
						<th>Ação</th>
					</tr>
				</thead>
				<tbody>
					{currentItems.map((player) => (
						<tr key={player.id}>
							<td>
								<p className="opacity-80">{player.nome}</p>
							</td>
							<td>
								{player.capitao ? (
									<span className="flex items-center gap-3">
										<p className="opacity-80">{player.apelido}</p>{" "}
										<span className="bg-[#FADD00] w-[25px] h-[25px] rounded-[50%] flex justify-center items-center">
											<p className="body-medium-bold text-white">C</p>
										</span>
									</span>
								) : player.posicao === "Libero" ? (
									<span className="flex items-center gap-3">
										<p className="opacity-80">{player.apelido}</p>{" "}
										<span className="bg-[#29A3CF] w-[25px] h-[25px] rounded-[50%] flex justify-center items-center">
											<p className="body-medium-bold text-white">L</p>
										</span>
									</span>
								) : (
									<p className="opacity-80">{player.apelido}</p>
								)}
							</td>
							<td>
								<p className="opacity-80">{player.posicao}</p>
							</td>
							<td>
								<p className="opacity-80">{player.numero}</p>
							</td>
							<td>
								<p className="opacity-80">{player.altura}</p>
							</td>
							<td>
								<p className="opacity-80">{player.nascimento}</p>
							</td>
							<td>
								<p className="opacity-80">{player.analises}</p>
							</td>
							<td>
								<BotaoComRota texto="+ Análise" route="/nova-analise" size="small" />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div id="footer" className="flex justify-between py-[16px]">
				{/* Dropdown para selecionar a quantidade de itens por página */}
				<div className="flex items-center">
					<div id="left" className="flex items-center gap-0">
						<p className="body-medium-semibold">Exibir</p>
						<div>
							<Select
								open={openItemsPerPage}
								onOpen={() => setOpenItemsPerPage(true)}
								onClose={() => setOpenItemsPerPage(false)}
								value={itemsPerPage}
								onChange={handleItemsPerPageChange}
								IconComponent={() => (
									<div
										onClick={() => setOpenItemsPerPage(!openItemsPerPage)}
										style={{ cursor: "pointer" }}
									>
										<CustomArrow
											style={{
												width: "13px",
												margin: "0px",
												height: "13px",
												transform: openItemsPerPage ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 2s ease-in-out",
											}}
										/>
									</div>
								)}
								className="body-medium-semibold"
								sx={{
									"& .MuiSelect-select": {
										display: "flex",
										alignItems: "center",
									},
									"& .MuiOutlinedInput-notchedOutline": {
										border: "none",
									},
								}}
							>
								<MenuItem value={5}>05</MenuItem>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={15}>15</MenuItem>
							</Select>
						</div>
					</div>
					<div className="w-[2px] h-[40px] bg-[#CCCCCC] mx-[20px]" />
					<div className="flex items-center">
						<p className="body-medium-semibold">{itemsDisplayText}</p>
					</div>
				</div>

				<div className="flex items-center">
					<div className="flex items-center">
						<p className="body-medium-semibold">Página</p>
						<Select
							open={openPageSelect}
							onOpen={() => setOpenPageSelect(true)}
							onClose={() => setOpenPageSelect(false)}
							value={currentPage}
							onChange={handlePageChange}
							IconComponent={() => (
								<div
									onClick={() => setOpenPageSelect(!openPageSelect)}
									style={{ cursor: "pointer" }}
								>
									<CustomArrow
										style={{
											width: "13px",
											margin: "0px",
											height: "13px",
											transform: openPageSelect ? "rotate(180deg)" : "rotate(0deg)",
											transition: "transform 2s ease-in-out",
										}}
									/>
								</div>
							)}
							className="body-medium-semibold"
							sx={{
								"& .MuiSelect-select": {
									display: "flex",
									alignItems: "center",
								},
								"& .MuiOutlinedInput-notchedOutline": {
									border: "none",
								},
							}}
						>
							{pageOptions.map((page) => (
								<MenuItem key={page} value={page}>
									{page}
								</MenuItem>
							))}
						</Select>
					</div>
					<div className="w-[2px] h-[40px] bg-[#CCCCCC] mx-[20px]" />
					{/* Controles de paginação */}
					<div id="right" className="flex items-center gap-8">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
						>
							<CustomArrow
								style={{
									width: "13px",
									margin: "0px",
									height: "13px",
									transform: "rotate(90deg)",
								}}
							/>
						</button>

						<button
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={currentPage === totalPages}
						>
							<CustomArrow
								style={{
									width: "13px",
									margin: "0px",
									height: "13px",
									transform: "rotate(-90deg)",
								}}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TableJogadores;
