function Title(props: TitleProps) {
	const { title } = props;

	return (
		<div className="flex flex-col gap-[16px]">
			<h2>{title}</h2>
			<div className="h-[2px] bg-[#D4D4D4] w-full" />
		</div>
	);
}

interface TitleProps {
	title: string;
}

export default Title;
