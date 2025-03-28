export enum BotaoCallbackStyle {
    Filled = "filled",
    Muted = "muted",
    Outline = "outline",
}

function BotaoCallback(props: BotaoCallbackProps) {
	const { children, style, onClick } = props;
    const disabled = props.disabled ? true : undefined;

    const BUTTON_BASE_CLASSNAMES = "flex justify-center items-center enabled:cursor-pointer rounded-full py-2 px-4 font-bold disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
    const BUTTON_CLASSNAMES_BY_STYLE: Record<BotaoCallbackStyle, string> = {
        [BotaoCallbackStyle.Filled]: "bg-zerondary text-white enabled:hover:bg-primary",
        [BotaoCallbackStyle.Muted]: "bg-primary text-white enabled:hover:bg-secondary",
        [BotaoCallbackStyle.Outline]: "border-2 border-zerondary text-zerondary enabled:hover:bg-secondary",
    };
    const INJECTED_CLASSNAMES = props.className ? `${props.className} ` : "";

	return (
            <button
                type={onClick ? "button" : "submit"}
                onClick={onClick}
                disabled={disabled}
                className={`${BUTTON_BASE_CLASSNAMES} ${BUTTON_CLASSNAMES_BY_STYLE[style]} ${INJECTED_CLASSNAMES}`}
            >
                <span>
                    {children}
                </span>
            </button>
	);
}

interface BotaoCallbackProps {
	children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    style: BotaoCallbackStyle;
	onClick?: () => void;
}

export default BotaoCallback;
