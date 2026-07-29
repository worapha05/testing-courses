import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InviteForm } from './InviteForm';

describe('InviteForm', () => {
  it('validates empty email', async () => {
    const user = userEvent.setup();
    const onInvite = jest.fn();
    render(<InviteForm onInvite={onInvite} />);

    await user.click(screen.getByRole('button', { name: /send invite/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i);
    expect(onInvite).not.toHaveBeenCalled();
  });

  it('shows success after invite resolves', async () => {
    const user = userEvent.setup();
    const onInvite = jest.fn().mockResolvedValue(undefined);
    render(<InviteForm onInvite={onInvite} />);

    await user.type(screen.getByLabelText(/email/i), 'new@pulse.test');
    await user.click(screen.getByRole('button', { name: /send invite/i }));

    expect(onInvite).toHaveBeenCalledWith('new@pulse.test');
    expect(await screen.findByRole('status')).toHaveTextContent(/invite sent/i);
  });

  it('shows error when onInvite rejects', async () => {
    const user = userEvent.setup();
    const onInvite = jest.fn().mockRejectedValue(new Error('Already invited'));
    render(<InviteForm onInvite={onInvite} />);

    await user.type(screen.getByLabelText(/email/i), 'old@pulse.test');
    await user.click(screen.getByRole('button', { name: /send invite/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/already invited/i);
  });
});
