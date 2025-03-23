function Subtitle(props: SubtitleProps) {
	const { title } = props;
	return (
		<div>
			<p className="body-medium-bold">{title}</p>
			<div className="w-full h-[2px] bg-[#D4D4D4] mt-[10px] mb-[20px]" />
		</div>
	);
}

interface SubtitleProps {
	title: string;
}

export default Subtitle;
