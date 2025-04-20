import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
	id: string;
	name: string;
	nickname: string;
	// outros campos, se houver
}

interface Team {
	id: string;
	name: string;
	abbreviation: string;
	// outros campos, se houver
}

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	team: Team | null; // Permite que o time seja null inicialmente
	setTeam: (team: Team | null) => void; // Permite setar null ou Team
	login: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [team, setTeam] = useState<Team | null>(null); // O estado de team agora permite null

	const login = (user: User) => {
		setUser(user);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, team, setTeam, login }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
