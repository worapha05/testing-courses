import { useState } from 'react';

type CounterProps = {
  initial?: number;
  label?: string;
};

export function Counter({ initial = 0, label = 'Count' }: CounterProps) {
  const [count, setCount] = useState(initial);

  return (
    <div>
      <p>
        {label}: <span data-testid="value">{count}</span>
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setCount((c) => c - 1)}>
        Decrement
      </button>
    </div>
  );
}
