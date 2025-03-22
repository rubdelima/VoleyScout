import React, { useState } from "react";

interface Player {
	id: number;
	name: string;
	// Adicione outros campos conforme necessário
}

interface TableProps {
	items: Player[];
}

function Table(props: TableProps) {
	const { items } = props;
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);

	// Calcula o índice inicial e final dos itens a serem exibidos na página atual
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

	// Calcula o número total de páginas
	const totalPages = Math.ceil(items.length / itemsPerPage);

	// Função para mudar a página
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	// Função para mudar a quantidade de itens por página
	const handleItemsPerPageChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setItemsPerPage(Number(event.target.value));
		setCurrentPage(1); // Resetar para a primeira página ao mudar a quantidade de itens por página
	};

	return (
		<div>
			{/* Dropdown para selecionar a quantidade de itens por página */}
			<select value={itemsPerPage} onChange={handleItemsPerPageChange}>
				<option value={5}>5 por página</option>
				<option value={10}>10 por página</option>
				<option value={15}>15 por página</option>
				<option value={20}>20 por página</option>
			</select>

			{/* Tabela de jogadores */}
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Nome</th>
						{/* Adicione outros cabeçalhos conforme necessário */}
					</tr>
				</thead>
				<tbody>
					{currentItems.map((player) => (
						<tr key={player.id}>
							<td>{player.id}</td>
							<td>{player.name}</td>
							{/* Adicione outras células conforme necessário */}
						</tr>
					))}
				</tbody>
			</table>

			{/* Controles de paginação */}
			<div>
				<button
					onClick={() => paginate(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Anterior
				</button>
				<span>
					Página {currentPage} de {totalPages}
				</span>
				<button
					onClick={() => paginate(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Próxima
				</button>
			</div>
		</div>
	);
}

export default Table;
