/**
 * Avance de un proyecto según un milestone de GitHub (Reunión 006, ADR 0002).
 * Se consulta al compilar. Ante cualquier problema devuelve `null`: el
 * proyecto se publica sin barra y el build nunca se rompe.
 */

export interface Progress {
  closed: number;
  total: number;
  /** Entero de 0 a 100. Solo llega a 100 con todos los issues cerrados. */
  percent: number;
}

interface Options {
  fetch?: typeof globalThis.fetch;
  /** Token de solo lectura. Sin él, la consulta va sin autenticar. */
  token?: string;
  timeoutMs?: number;
}

interface Milestone {
  title: string;
  open_issues: number;
  closed_issues: number;
}

/** `https://github.com/dueño/repo` → `{ owner, name }`; cualquier otra URL → `null`. */
export function parseRepo(url: string): { owner: string; name: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname !== 'github.com') return null;
  const [owner, name] = parsed.pathname.split('/').filter(Boolean);
  if (!owner || !name) return null;
  return { owner, name: name.replace(/\.git$/, '') };
}

export async function getMilestoneProgress(
  repo: string | undefined,
  milestone: string | undefined,
  { fetch = globalThis.fetch, token, timeoutMs = 10_000 }: Options = {},
): Promise<Progress | null> {
  if (!repo || !milestone) return null;

  const target = parseRepo(repo);
  if (!target) return skip(repo, 'no es un repositorio de GitHub');

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `https://api.github.com/repos/${target.owner}/${target.name}/milestones?state=all&per_page=100`;

  let response: Response;
  try {
    response = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    return skip(repo, `la API no respondió (${(error as Error).message})`);
  }

  if (response.status === 404) return skip(repo, 'el repositorio no existe o no es público');
  if (response.status === 429 || response.headers.get('x-ratelimit-remaining') === '0') {
    return skip(repo, 'se agotó el límite de la API');
  }
  if (!response.ok) return skip(repo, `la API respondió ${response.status}`);

  let milestones: Milestone[];
  try {
    milestones = (await response.json()) as Milestone[];
  } catch {
    return skip(repo, 'la respuesta de la API no es JSON válido');
  }

  const found = milestones.find((m) => m.title === milestone);
  if (!found) return skip(repo, `no existe el milestone "${milestone}"`);

  const closed = found.closed_issues;
  const total = found.open_issues + closed;
  if (total === 0) return skip(repo, `el milestone "${milestone}" no tiene issues`);

  return { closed, total, percent: Math.floor((closed / total) * 100) };
}

/** Deja el motivo en el log del build y sigue sin barra. */
function skip(repo: string, reason: string): null {
  console.warn(`[avance] ${repo}: ${reason}; se muestra sin barra.`);
  return null;
}
