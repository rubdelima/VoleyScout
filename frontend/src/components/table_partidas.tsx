import React, { useState } from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { ReactComponent as CustomArrow } from "../assets/seta.svg";
import Analisador from "./analisador";
import Subtitle from "./subtitle";

export interface Partida {
	id: number;
	equipe: string;
	sigla_equipe: string;
	adversario: string;
	sigla_adversario: string;
	n_sets: number;
	resultado: string;
	data: string;
	situacao: string;
	jogadores_analisados: number;
}


interface TablePartidasProps {
	items: Partida[];
	title: string;
}

function TablePartidas(props: TablePartidasProps) {
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
			{/* Tabela de jogadores */}
			<table>
				<thead>
					<tr>
						<th>
							<p>Equipe</p>
						</th>
						<th>Adversário</th>
						<th>Nº Sets</th>
						<th>Resultado</th>
						<th>Data</th>
						<th>Situação</th>
						<th>Jogadores analisados</th>
						<th>Analisadores</th>
					</tr>
				</thead>
				<tbody>
					{currentItems.map((player) => (
						<tr key={player.id}>
							<td>
								<p className="opacity-80">{player.equipe}</p>
							</td>
							<td>
								<p className="opacity-80">{player.adversario}</p>
							</td>
							<td>
								<p className="opacity-80">{player.n_sets}</p>
							</td>
							<td>
								<p className="opacity-80">{player.resultado}</p>
							</td>
							<td>
								<p className="opacity-80">{player.data}</p>
							</td>
							<td>
								{player.situacao === "Vitória" ? (
									<span className="bg-[#99D2B7] w-fit px-[15px] py-[8px] rounded-[20px] flex justify-center items-center">
										<p className="text-[#206922] body-medium-bold">{player.situacao}</p>
									</span>
								) : (
									<span className="bg-[#F2A4A4] w-fit px-[15px] py-[8px] rounded-[20px] flex justify-center items-center">
										<p className="text-[#DB1D1D] body-medium-bold">{player.situacao}</p>
									</span>
								)}
							</td>
							<td>
								<p className="opacity-80">{player.jogadores_analisados}</p>
							</td>
							<td>
								<Analisador />
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

export default TablePartidas;
