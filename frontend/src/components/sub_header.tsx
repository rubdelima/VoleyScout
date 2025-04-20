function SubHeader(props: SubHeaderProps) {
	const { children } = props;
	return (
		<div className="w-full border-b border-[#D4D4D4] mt-4 mb-2">
			<h3 className="font-semibold text-2xl mb-2">
                { children }
            </h3>
		</div>
	);
}

interface SubHeaderProps {
    children?: React.ReactNode;
}

export default SubHeader;
