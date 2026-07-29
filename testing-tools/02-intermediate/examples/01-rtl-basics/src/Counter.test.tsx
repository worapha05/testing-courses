import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders initial value', () => {
    render(<Counter initial={3} />);
    expect(screen.getByText(/count:/i)).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('3');
  });

  it('increments and decrements when buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('value')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.getByTestId('value')).toHaveTextContent('0');
  });
});
