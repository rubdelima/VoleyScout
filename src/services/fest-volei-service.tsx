import axios from 'axios';
import { Jogador } from '../constants/Jogador';

const api = axios.create({
    baseURL: 'https://scoutai.onthewifi.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

class ApiService {
    async executeRequest<T = any>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        data?: any,
        customHeaders?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        try {
            const response = await api.request<T>({
                method,
                url: endpoint,
                data,
                headers: {
                    ...customHeaders,
                },
            });

            return {
                data: response.data,
                status: response.status,
            };
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                // Retorna um erro tratado em vez de deixar a função sem retorno
                return Promise.reject({
                    message: error.response.data?.message || 'Erro na requisição',
                    status: error.response.status,
                    data: error.response.data,
                });
            } else {
                return Promise.reject({
                    message: 'Erro de conexão',
                    status: 500,
                });
            }
        }
    }

    async adicionarJogador(jogadorData: Jogador) {
        return this.executeRequest(
            'POST',
            'players',
            jogadorData);
    }
}

export const apiService = new ApiService();
