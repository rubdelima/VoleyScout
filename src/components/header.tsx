import Menu from "../../src/components/menu";
import Profile from "../../src/components/profile";

interface HeaderProps {
  userName?: string;
}

function Header({ userName }: HeaderProps) {
	return (
		<div className="w-full bg-[#00729B] h-[46px] flex justify-between align-center py-[3.5px] px-[8.5px]">
			<Menu />
			<Profile userName={userName} />
		</div>
	);
}

export default Header;
