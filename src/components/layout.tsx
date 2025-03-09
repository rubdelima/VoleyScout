function Layout(props: LayoutProps) {
	const { children } = props;

	return (
		<div>
			<div className="flex flex-col mx-5 my-5 sm:mx-16 sm:my-10 gap-[16px]">
				{children}
			</div>
		</div>
	);
}

interface LayoutProps {
	children: React.ReactNode;
}

export default Layout;
