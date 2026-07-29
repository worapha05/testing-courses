import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemberCard } from './MemberCard';

describe('MemberCard', () => {
  it('renders name, role, and status', () => {
    render(<MemberCard name="Ada" role="admin" status="active" />);
    expect(screen.getByRole('heading', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByText(/role: admin/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /resend invite/i })).not.toBeInTheDocument();
  });

  it('calls onResend when invited member button is clicked', async () => {
    const user = userEvent.setup();
    const onResend = jest.fn();
    render(<MemberCard name="Grace" role="member" status="invited" onResend={onResend} />);

    await user.click(screen.getByRole('button', { name: /resend invite/i }));
    expect(onResend).toHaveBeenCalledTimes(1);
  });
});
