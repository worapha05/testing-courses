import { rest } from 'msw';

export type Member = {
  id: string;
  name: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited';
};

export const handlers = [
  rest.get('/api/members', (_req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json<Member[]>([
        { id: '1', name: 'Ada', role: 'admin', status: 'active' },
        { id: '2', name: 'Grace', role: 'member', status: 'invited' },
      ]),
    ),
  ),
];
