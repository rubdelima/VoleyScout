import { useState } from "react";
import Contador, { ContadorProps } from "./contador";

export interface PainelAcaoProps {
  title: string;
  counters: ContadorProps[];
}

function PainelAcao({ title, counters }: PainelAcaoProps) {
  const getTotalTries = () => counters.reduce((sum, counter) => sum + counter.value, 0);

  const [totalTries, setTotalTries] = useState(getTotalTries());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full p-4 border-2 border-primary rounded-xl justify-start">
      <div className="col-span-1 flex flex-col justify-center">
        <p className="font-semibold text-2xl">{title}</p>
      </div>
      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        {counters.map((counter) => {
          counter.onValueChange = (value => {
            counter.value = value;
            setTotalTries(getTotalTries());
          })

          return <Contador
            key={counter.label}
            {...counter}
          />
        }
        )}

      </div>
      <div className="col-span-1 flex flex-col lg:items-center text-zerondary font-semibold text-xl">
        <p className="mb-2">Tentativas</p>
        <span className="text-2xl py-2">{totalTries}</span>
      </div>
    </div>
  );
}

export default PainelAcao;