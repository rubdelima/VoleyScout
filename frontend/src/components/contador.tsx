import { useState } from 'react';
import BotaoCallback, { BotaoCallbackStyle } from './botao_callback';

export interface ContadorProps {
  label: string;
  value: number;
  onValueChange?: (value: number) => void;
}

function Contador({ value, onValueChange, label }: ContadorProps) {
  const [count, setCount] = useState(value);

  const handleIncrease = () => {
    const newValue = count + 1;
    setCount(newValue);
    onValueChange?.(newValue);
  };

  const handleDecrease = () => {
    const newValue = count - 1;
    setCount(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="flex flex-col items-center w-full gap-2.5">
      <p className="text-xl font-semibold text-zerondary"> {label} </p>
      <div className="flex items-center flex-row gap-1 w-full">
        <BotaoCallback onClick={handleDecrease} style={BotaoCallbackStyle.Muted} className="min-w-12" disabled={count <= 0}>
          <span aria-hidden="true" className="text-2xl">-</span> <span className="sr-only">Diminuir</span>
        </BotaoCallback>
        <span className="w-full p-2 border-2 border-zerondary rounded-full text-center text-xl">{count}</span>
        <BotaoCallback onClick={handleIncrease} style={BotaoCallbackStyle.Filled} className="min-w-12">
          <span aria-hidden="true" className="text-2xl">+</span> <span className="sr-only">Aumentar</span>
        </BotaoCallback>
      </div>
    </div>
  );
}

export default Contador;
