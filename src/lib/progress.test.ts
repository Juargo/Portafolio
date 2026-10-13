import { describe, expect, it, vi } from 'vitest';
import { getMilestoneProgress, parseRepo } from './progress';

const REPO = 'https://github.com/juargo/acrux';

function respond(status: number, body: unknown = [], headers: Record<string, string> = {}) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status, headers }));
}

const milestone = (title: string, open: number, closed: number) => ({
  title,
  open_issues: open,
  closed_issues: closed,
});

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

describe('getMilestoneProgress', () => {
  it('computes closed / total for the declared milestone', async () => {
    const fetch = respond(200, [milestone('Otro', 1, 1), milestone('MVP', 3, 9)]);
    const result = await getMilestoneProgress(REPO, 'MVP', { fetch, token: 'tok' });
    expect(result).toEqual({ closed: 9, total: 12, percent: 75 });
  });

  it('queries every milestone of the repository with the token', async () => {
    const fetch = respond(200, [milestone('MVP', 1, 1)]);
    await getMilestoneProgress(REPO, 'MVP', { fetch, token: 'tok' });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.github.com/repos/juargo/acrux/milestones?state=all&per_page=100');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  });

  it('shows 100 when every issue is closed', async () => {
    const fetch = respond(200, [milestone('MVP', 0, 4)]);
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch })).toEqual({ closed: 4, total: 4, percent: 100 });
  });

  it('queries without authentication when there is no token', async () => {
    const fetch = respond(200, [milestone('MVP', 1, 1)]);
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch })).toEqual({ closed: 1, total: 2, percent: 50 });
    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('returns null when the API request fails', async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch })).toBeNull();
  });

  it('returns null when the API answers with a server error', async () => {
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch: respond(500) })).toBeNull();
  });

  it('returns null when the rate limit is exhausted', async () => {
    const fetch = respond(403, { message: 'API rate limit exceeded' }, { 'x-ratelimit-remaining': '0' });
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch })).toBeNull();
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch: respond(429) })).toBeNull();
  });

  it('returns null when the repository does not exist', async () => {
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch: respond(404, { message: 'Not Found' }) })).toBeNull();
  });

  it('returns null when the milestone does not exist', async () => {
    const fetch = respond(200, [milestone('Otro', 2, 2)]);
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch })).toBeNull();
  });

  it('returns null when the milestone has no issues', async () => {
    const fetch = respond(200, [milestone('MVP', 0, 0)]);
    expect(await getMilestoneProgress(REPO, 'MVP', { fetch })).toBeNull();
  });

  it('returns null without calling the API when repo or milestone is missing', async () => {
    const fetch = respond(200, []);
    expect(await getMilestoneProgress(undefined, 'MVP', { fetch })).toBeNull();
    expect(await getMilestoneProgress(REPO, undefined, { fetch })).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
