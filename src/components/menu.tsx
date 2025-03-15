import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuRoundedIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom"; // Importando o hook useNavigate e useLocation
import Stack from "@mui/material/Stack"; // Usando o Stack para alinhamento horizontal

function Menu() {
	const [state, setState] = React.useState({
		left: false,
	});

	const navigate = useNavigate(); // Usando o hook useNavigate
	const location = useLocation(); // Usando o hook useLocation para obter a rota atual

	// Função para abrir/fechar o Drawer
	const toggleDrawer =
		(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}

			setState({ ...state, left: open });
		};

	// Função de redirecionamento
	const handleNavigation = (route: string) => {
		navigate(route); // Realiza o redirecionamento para a página correspondente
	};

	// Função que retorna a rota correspondente para cada item do menu
	const getRoute = (index: number) => {
		switch (index) {
			case 0:
				return "/"; // Página Inicial
			case 1:
				return "/equipes"; // Equipes
			case 2:
				return "/meu-time"; // Meu time
			default:
				return "/";
		}
	};

	// Função que retorna o título de acordo com a rota atual
	const getTitle = () => {
		switch (location.pathname) {
			case "/":
				return "Página inicial";
			case "/equipes":
				return "Equipe";
			case "/meu-time":
				return "Meu time";
			default:
				return "";
		}
	};

	const list = () => (
		<Box
			sx={{ width: 250 }} // Ajuste de largura para o Drawer
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<List>
				{["Página inicial", "Equipes", "Meu time"].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton onClick={() => handleNavigation(getRoute(index))}>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<div>
			{/* Botão para abrir o Drawer à esquerda, com ícone e título */}
			<Button
				sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
				onClick={toggleDrawer(true)}
				startIcon={
					<Stack direction="row" spacing={1} alignItems="center">
						<MenuRoundedIcon fontSize="medium" style={{ fill: "#ffffff" }} />
						<Box
							sx={{
								color: "#ffffff",
								textTransform: "none",
								fontFamily: "Nunito",
							}}
						>
							<span className="body-medium">{getTitle()}</span>
						</Box>
					</Stack>
				}
			/>
			<Drawer anchor="left" open={state.left} onClose={toggleDrawer(false)}>
				{list()}
			</Drawer>
		</div>
	);
}

export default Menu;
