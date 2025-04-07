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
	teams: Team[];
	setTeams: (teams: Team[]) => void;
	login: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [teams, setTeams] = useState<Team[]>([]);

	const login = (user: User) => {
		setUser(user);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, teams, setTeams, login }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
