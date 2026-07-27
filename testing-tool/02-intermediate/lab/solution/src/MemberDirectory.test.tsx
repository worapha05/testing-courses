import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { MemberDirectory } from './MemberDirectory';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MemberDirectory', () => {
  it('loads and renders members', async () => {
    render(<MemberDirectory />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading members/i);
    expect(await screen.findByRole('heading', { name: /directory/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Grace' })).toBeInTheDocument();
  });

  it('shows alert on 401', async () => {
    server.use(
      rest.get('/api/members', (_req, res, ctx) =>
        res(ctx.status(401), ctx.json({ message: 'no' })),
      ),
    );
    render(<MemberDirectory />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed with 401/i);
  });

  it('shows empty state', async () => {
    server.use(rest.get('/api/members', (_req, res, ctx) => res(ctx.json([]))));
    render(<MemberDirectory />);
    expect(await screen.findByText(/no members yet/i)).toBeInTheDocument();
  });
});
