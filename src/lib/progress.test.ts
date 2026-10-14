import { describe, expect, it, vi } from 'vitest';
import { getMilestones, parseRepo } from './progress';

const REPO = 'https://github.com/juargo/acrux';

function respond(status: number, body: unknown = [], headers: Record<string, string> = {}) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status, headers }));
}

let number = 0;
const milestone = (
  title: string,
  open: number,
  closed: number,
  { state = 'open', due_on = null }: { state?: string; due_on?: string | null } = {},
) => ({ number: ++number, title, state, due_on, open_issues: open, closed_issues: closed });

describe('parseRepo', () => {
  it('extracts owner and name from a GitHub URL', () => {
    expect(parseRepo('https://github.com/juargo/acrux')).toEqual({ owner: 'juargo', name: 'acrux' });
    expect(parseRepo('https://github.com/juargo/acrux.git/')).toEqual({ owner: 'juargo', name: 'acrux' });
  });

  it('rejects URLs that are not a GitHub repository', () => {
    expect(parseRepo('https://gitlab.com/juargo/acrux')).toBeNull();
    expect(parseRepo('https://github.com/juargo')).toBeNull();
  });
});

describe('getMilestones', () => {
  it('computes closed / total for every milestone of the repository', async () => {
    const fetch = respond(200, [
      milestone('v0.1', 0, 4, { state: 'closed', due_on: '2026-09-30T07:00:00Z' }),
      milestone('MVP', 3, 9, { due_on: '2026-10-28T07:00:00Z' }),
    ]);
    expect(await getMilestones(REPO, { fetch, token: 'tok' })).toEqual([
      { title: 'v0.1', state: 'closed', dueOn: '2026-09-30T07:00:00Z', closed: 4, total: 4, percent: 100 },
      { title: 'MVP', state: 'open', dueOn: '2026-10-28T07:00:00Z', closed: 9, total: 12, percent: 75 },
    ]);
  });

  it('orders milestones by due date, and those without one last in creation order', async () => {
    const fetch = respond(200, [
      milestone('Sin fecha A', 1, 0),
      milestone('Tarde', 1, 0, { due_on: '2026-12-01T00:00:00Z' }),
      milestone('Sin fecha B', 1, 0),
      milestone('Pronto', 1, 0, { due_on: '2026-10-01T00:00:00Z' }),
    ]);
    const result = await getMilestones(REPO, { fetch });
    expect(result?.map((m) => m.title)).toEqual(['Pronto', 'Tarde', 'Sin fecha A', 'Sin fecha B']);
  });

  it('skips milestones without issues and keeps the rest', async () => {
    const fetch = respond(200, [milestone('Vacío', 0, 0), milestone('MVP', 1, 1)]);
    expect((await getMilestones(REPO, { fetch }))?.map((m) => m.title)).toEqual(['MVP']);
  });

  it('skips milestones with incomplete data and keeps the rest', async () => {
    const fetch = respond(200, [{ title: 'Roto' }, milestone('MVP', 1, 1)]);
    expect((await getMilestones(REPO, { fetch }))?.map((m) => m.title)).toEqual(['MVP']);
  });

  it('drops an unreadable due date instead of failing', async () => {
    const fetch = respond(200, [milestone('MVP', 1, 1, { due_on: 'not-a-date' })]);
    expect((await getMilestones(REPO, { fetch }))?.[0].dueOn).toBeNull();
  });

  it('only reaches 100 when every issue is closed', async () => {
    const fetch = respond(200, [milestone('Casi', 1, 199), milestone('Listo', 0, 4)]);
    expect((await getMilestones(REPO, { fetch }))?.map((m) => m.percent)).toEqual([99, 100]);
  });

  it('queries every milestone of the repository with the token', async () => {
    const fetch = respond(200, [milestone('MVP', 1, 1)]);
    await getMilestones(REPO, { fetch, token: 'tok' });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.github.com/repos/juargo/acrux/milestones?state=all&per_page=100');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  });

  it('queries without authentication when there is no token', async () => {
    const fetch = respond(200, [milestone('MVP', 1, 1)]);
    expect(await getMilestones(REPO, { fetch })).toHaveLength(1);
    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('retries without the token when it is rejected', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([milestone('MVP', 1, 1)]), { status: 200 }));
    expect(await getMilestones(REPO, { fetch, token: 'expired' })).toHaveLength(1);
    const [, retry] = fetch.mock.calls[1] as unknown as [string, RequestInit];
    expect((retry.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('keeps a successful answer that used the last request of the rate limit', async () => {
    const fetch = respond(200, [milestone('MVP', 1, 3)], { 'x-ratelimit-remaining': '0' });
    expect(await getMilestones(REPO, { fetch })).toHaveLength(1);
  });

  it('returns null when the repository has no milestones with issues', async () => {
    expect(await getMilestones(REPO, { fetch: respond(200, []) })).toBeNull();
    expect(await getMilestones(REPO, { fetch: respond(200, [milestone('Vacío', 0, 0)]) })).toBeNull();
  });

  it('returns null when the API request fails', async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    expect(await getMilestones(REPO, { fetch })).toBeNull();
  });

  it('returns null when the API does not answer in time', async () => {
    const fetch = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
        }),
    );
    expect(await getMilestones(REPO, { fetch, timeoutMs: 10 })).toBeNull();
  });

  it('returns null when the API answers with a server error', async () => {
    expect(await getMilestones(REPO, { fetch: respond(500) })).toBeNull();
  });

  it('returns null when the rate limit is exhausted', async () => {
    const fetch = respond(403, { message: 'API rate limit exceeded' }, { 'x-ratelimit-remaining': '0' });
    expect(await getMilestones(REPO, { fetch })).toBeNull();
    expect(await getMilestones(REPO, { fetch: respond(429) })).toBeNull();
  });

  it('returns null when the repository does not exist', async () => {
    expect(await getMilestones(REPO, { fetch: respond(404, { message: 'Not Found' }) })).toBeNull();
  });

  it('returns null when the body is not a list of milestones', async () => {
    expect(await getMilestones(REPO, { fetch: respond(200, { message: 'odd' }) })).toBeNull();
  });

  it('returns null without calling the API when there is no repo', async () => {
    const fetch = respond(200, []);
    expect(await getMilestones(undefined, { fetch })).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
