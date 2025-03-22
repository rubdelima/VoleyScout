import IconButton from "@mui/material/IconButton";
import profile from "../assets/profile.svg";

function Profile() {
	return (
		<div>
			<IconButton>
				<img src={profile} alt="" />
			</IconButton>
		</div>
	);
}

export default Profile;
