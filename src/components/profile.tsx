import IconButton from "@mui/material/IconButton";
import profile from "../assets/profile.svg";

function Profile(props: ProfileProps) {
	return (
		<div>
			<IconButton>
				<img src={profile} alt="" />
			</IconButton>
		</div>
	);
}

interface ProfileProps {
	// itemOne: string;
}

export default Profile;
