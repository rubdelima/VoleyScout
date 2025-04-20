function IndicadorObrigatorio(props: IndicadorObrigatorioProps) {
	const { obrigatorio } = props;

    if (obrigatorio) {
        return (
            <span className="text-red-500" aria-hidden="true">
                *
            </span>
        );
    } else {
        return (
            <span className="text-disabled">
                (opcional)
            </span>
        );
    }
}

interface IndicadorObrigatorioProps {
	obrigatorio: boolean;
}

export default IndicadorObrigatorio;
