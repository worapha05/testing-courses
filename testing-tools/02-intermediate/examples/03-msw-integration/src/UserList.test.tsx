import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { UserList } from './UserList';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserList', () => {
  it('shows loading then the user list', async () => {
    render(<UserList />);

    expect(screen.getByRole('status')).toHaveTextContent(/loading users/i);
    expect(await screen.findByRole('heading', { name: /users/i })).toBeInTheDocument();
    expect(screen.getByText(/ada lovelace/i)).toBeInTheDocument();
    expect(screen.getByText(/alan turing/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows an alert when the API fails', async () => {
    server.use(
      rest.get('/api/users', (_req, res, ctx) =>
        res(ctx.status(500), ctx.json({ message: 'nope' })),
      ),
    );

    render(<UserList />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/failed with 500/i);
    expect(screen.queryByRole('heading', { name: /users/i })).not.toBeInTheDocument();
  });

  it('shows empty state when API returns []', async () => {
    server.use(rest.get('/api/users', (_req, res, ctx) => res(ctx.json([]))));

    render(<UserList />);

    expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
  });
});
