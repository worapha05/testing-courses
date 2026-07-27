import { rest } from 'msw';

export type User = { id: string; name: string; role: string };

export const handlers = [
  rest.get('/api/users', (_req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json<User[]>([
        { id: '1', name: 'Ada Lovelace', role: 'admin' },
        { id: '2', name: 'Alan Turing', role: 'member' },
      ]),
    ),
  ),
];
