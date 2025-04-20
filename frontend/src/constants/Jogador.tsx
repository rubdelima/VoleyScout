export enum Posicao {
	Ponteiro = "Ponteiro",
	Oposto = "Oposto",
	Central = "Central",
	Levantador = "Levantador",
	Líbero = "Líbero"
}

export interface Jogador {
    name: string;
    nickname: string;
    position: Posicao;
    number: string;
    height: number;
    birthdate: string;
    isCaptain: boolean;
    team: string;
}