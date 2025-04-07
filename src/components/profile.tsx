import IconButton from "@mui/material/IconButton";
import profile from "../assets/profile.svg";

interface ProfileProps {
  userName?: string;
}

function Profile({ userName }: ProfileProps) {
	return (
		<div className="flex items-center gap-2 text-white">
			<IconButton>
				<img src={profile} alt="Perfil" />
			</IconButton>
			{userName && <span className="text-sm">{userName}</span>}
		</div>
	);
}

export default Profile;
