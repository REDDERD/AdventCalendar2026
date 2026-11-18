// Helpers to seed the Firebase emulator (project demo-hogwarts) for e2e tests.
const PROJECT = 'demo-hogwarts';
const AUTH = 'http://127.0.0.1:9099';
const FIRESTORE = 'http://127.0.0.1:8080';
const OWNER = { Authorization: 'Bearer owner', 'Content-Type': 'application/json' };

/** Playwright only waits for one URL; make sure Auth and Firestore both answer. */
export async function waitForEmulators(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (const url of [`${AUTH}/`, `${FIRESTORE}/`]) {
    for (;;) {
      try {
        await fetch(url);
        break;
      } catch {
        if (Date.now() > deadline) throw new Error(`Emulator not reachable: ${url}`);
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }
}

export async function resetEmulators(): Promise<void> {
  await fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });
  await fetch(`${FIRESTORE}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' });
}

/** Create an Auth account with a fixed uid. */
export async function createAccount(uid: string, username: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts`, {
    method: 'POST',
    headers: OWNER,
    body: JSON.stringify({ localId: uid, email: `${username}@hogwarts.example.com`, password }),
  });
  if (!res.ok) throw new Error(`createAccount ${res.status}: ${await res.text()}`);
}

type Value = string | number | boolean | null;

function toFields(data: Record<string, Value>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => {
      if (v === null) return [k, { nullValue: null }];
      if (typeof v === 'boolean') return [k, { booleanValue: v }];
      if (typeof v === 'number') return [k, { integerValue: String(v) }];
      return [k, { stringValue: v }];
    }),
  );
}

export async function setDocument(path: string, data: Record<string, Value>): Promise<void> {
  const res = await fetch(`${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/${path}`, {
    method: 'PATCH',
    headers: OWNER,
    body: JSON.stringify({ fields: toFields(data) }),
  });
  if (!res.ok) throw new Error(`setDocument ${res.status}: ${await res.text()}`);
}

export interface EventSummary {
  type: string;
  day: number | null;
  data: Record<string, unknown>;
}

export async function listEvents(): Promise<EventSummary[]> {
  const res = await fetch(`${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/events?pageSize=300`, {
    headers: OWNER,
  });
  const json = (await res.json()) as { documents?: Array<{ fields: Record<string, Record<string, unknown>> }> };
  return (json.documents ?? []).map((d) => ({
    type: String(d.fields.type.stringValue),
    day: d.fields.day.integerValue !== undefined ? Number(d.fields.day.integerValue) : null,
    data: d.fields.data as Record<string, unknown>,
  }));
}
