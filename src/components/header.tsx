import Menu from "../../src/components/menu";
import Profile from "../../src/components/profile";

function Header(props: HeaderProps) {
	return (
		<div className="w-full bg-[#00729B] h-[46px] flex justify-between align-center py-[3.5px] px-[8.5px]">
			<Menu />
			<Profile />
		</div>
	);
}

interface HeaderProps {
	// itemOne: string;
}

export default Header;
