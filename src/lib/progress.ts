/**
 * Avance de un proyecto según los milestones de su repositorio de GitHub
 * (Reunión 010, ADR 0005). Se consulta al compilar. Ante cualquier problema
 * devuelve `null`: el proyecto se publica sin barras y el build nunca se rompe.
 */

export interface MilestoneProgress {
  title: string;
  state: 'open' | 'closed';
  /** Fecha límite en ISO 8601, o `null` si el milestone no tiene. */
  dueOn: string | null;
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
  number: number;
  title: string;
  state: 'open' | 'closed';
  due_on: string | null;
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

export async function getMilestones(
  repo: string | undefined,
  { fetch = globalThis.fetch, token, timeoutMs = 10_000 }: Options = {},
): Promise<MilestoneProgress[] | null> {
  if (!repo) return null;

  const target = parseRepo(repo);
  if (!target) return skip(repo, 'no es un repositorio de GitHub');

  const url = `https://api.github.com/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.name)}/milestones?state=all&per_page=100`;
  const request = (withToken: boolean) => {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (withToken && token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
  };

  let response: Response;
  try {
    response = await request(true);
    // Token vencido o revocado: se reintenta sin autenticar (ADR 0002).
    if (response.status === 401 && token) {
      console.warn(`[avance] ${repo}: el token fue rechazado; se consulta sin autenticar.`);
      response = await request(false);
    }
  } catch (error) {
    return skip(repo, `la API no respondió (${(error as Error).message})`);
  }

  if (response.status === 404) return skip(repo, 'el repositorio no existe o no es público');
  if (response.status === 429 || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')) {
    return skip(repo, 'se agotó el límite de la API');
  }
  if (!response.ok) return skip(repo, `la API respondió ${response.status}`);

  let milestones: unknown;
  try {
    milestones = await response.json();
  } catch {
    return skip(repo, 'la respuesta de la API no es JSON válido');
  }
  if (!Array.isArray(milestones)) return skip(repo, 'la respuesta de la API no es una lista de milestones');

  const progress = (milestones as unknown[])
    .filter((m): m is Milestone => {
      if (isMilestone(m)) return true;
      console.warn(`[avance] ${repo}: se omite un milestone con datos incompletos.`);
      return false;
    })
    // Un milestone sin issues no tiene porcentaje (0 de 0): se omite.
    .filter((m) => m.open_issues + m.closed_issues > 0)
    // Una fecha ilegible se descarta: formatearla rompería el build.
    .map((m) => (m.due_on && Number.isNaN(Date.parse(m.due_on)) ? { ...m, due_on: null } : m))
    .sort(byDueDate)
    .map((m) => {
      const total = m.open_issues + m.closed_issues;
      return {
        title: m.title,
        state: m.state,
        dueOn: m.due_on,
        closed: m.closed_issues,
        total,
        percent: Math.floor((m.closed_issues / total) * 100),
      };
    });

  if (progress.length === 0) return skip(repo, 'no tiene milestones con issues');
  return progress;
}

function isMilestone(value: unknown): value is Milestone {
  const m = value as Partial<Milestone> | null;
  return (
    typeof m?.title === 'string' &&
    Number.isInteger(m.number) &&
    (m.state === 'open' || m.state === 'closed') &&
    (m.due_on === null || typeof m.due_on === 'string') &&
    Number.isInteger(m.open_issues) &&
    Number.isInteger(m.closed_issues)
  );
}

/** Por fecha límite; los que no tienen fecha van al final, en orden de creación. */
function byDueDate(a: Milestone, b: Milestone): number {
  if (a.due_on && b.due_on) return a.due_on.localeCompare(b.due_on) || a.number - b.number;
  if (a.due_on) return -1;
  if (b.due_on) return 1;
  return a.number - b.number;
}

/** Deja el motivo en el log del build y sigue sin barras. */
function skip(repo: string, reason: string): null {
  console.warn(`[avance] ${repo}: ${reason}; se muestra sin barras.`);
  return null;
}
