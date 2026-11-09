// The apps' accounts, from the browser: just enough of Appwrite's REST API for /delete/ (sign in with
// Google or Apple, read the account, file a deletion request, sign out). The apps speak the same API
// (Riyadh-Transport-iOS AppwriteAccount.swift, Riyadh-Transport-Android auth/AppwriteAuth.java).
//
// Calls go to `site.accounts.api`, the Worker, which makes them as a domain registered on the project
// (content/site.ts says why). Sign-in is an email and password, or Appwrite's OAuth token flow: the
// provider's page sends the visitor back with userId and secret in the query (by way of
// `signInReturn` while this domain isn't registered), and those are traded for a session. Appwrite
// hands the session over in the X-Fallback-Cookies header rather than as a cookie this domain could
// keep; it is kept for the tab only (sessionStorage) and sent back on every call, as Appwrite's own
// web SDK does.

import { site } from "@/content/site";

const { endpoint, api, signInReturn, project, database, requestsTable } = site.accounts;
const SESSION_KEY = "murtahil-account-session";

export type Provider = "google" | "apple";
export type Scope = "data" | "account";

/** Why a call failed, as Appwrite reports it. A request that never got an answer has code 0. */
export class AccountError extends Error {
  constructor(
    readonly code: number,
    readonly type: string,
    message: string,
  ) {
    super(message);
  }
  get unauthorized() {
    return this.code === 401;
  }
}

export type Account = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  /** How much the apps keep with the account (AccountSync): saved places and lines, searches, chats. */
  stored: { places: number; searches: number; chats: number };
  /** The billing cycle the account picked in the app ("plan_cycle" in its preferences). */
  chosenCycle: "monthly" | "annual" | null;
};

export type DeletionRequest = { scope: Scope; createdAt: string };

/**
 * The account's plan, read the way the apps read it (PlanManager): a plan is a team membership whose
 * roles name it ("premium" or "betatest") and may fix the billing cycle ("monthly" or "annual");
 * otherwise the cycle is the one the account chose, in its preferences.
 */
export type Plan = { kind: "free" | "beta" | "premium"; cycle: "monthly" | "annual" | null };

/**
 * What the stores say about the account's subscription, through the Murtahil function's /billing/status
 * (by way of the Worker, worker/index.js). `source` is null for a plan granted by hand in the console;
 * `willRenew` false means it is cancelled and only runs to `expiresAt`; null means the store didn't say.
 */
export type Billing = {
  premium: boolean;
  source: "app_store" | "play" | null;
  willRenew: boolean | null;
  expiresAt: number | null;
  cycle: "monthly" | "annual" | null;
  manageUrl: string | null;
};

/** Ask the stores, with a fifteen-minute JWT for the account. Throws when there is no answer. */
export async function getBilling(): Promise<Billing> {
  const { jwt } = await call<{ jwt?: string }>("POST", "/account/jwts");
  const response = await fetch("/api/billing-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jwt }),
  });
  if (!response.ok) throw new AccountError(response.status, "billing", response.statusText);
  const json = (await response.json()) as Record<string, unknown>;
  const source = json.source === "app_store" || json.source === "play" ? json.source : null;
  return {
    premium: json.plan === "PREMIUM",
    source,
    willRenew: typeof json.willRenew === "boolean" ? json.willRenew : null,
    expiresAt: typeof json.expiresAt === "number" ? json.expiresAt : null,
    cycle: json.cycle === "annual" || json.cycle === "monthly" ? json.cycle : null,
    manageUrl: typeof json.manageUrl === "string" && json.manageUrl ? json.manageUrl : null,
  };
}

/** Subscription settings in each store, for a plan that has to be cancelled where it was bought. */
export const storeSubscriptions = {
  appStore: "https://apps.apple.com/account/subscriptions",
  googlePlay: "https://play.google.com/store/account/subscriptions?package=com.riyadhtransport",
};

// The session is a value in memory first; storage only carries it across the reload a sign-in causes.
let fallback: string | null = null;

function storedSession() {
  if (fallback) return fallback;
  try {
    fallback = sessionStorage.getItem(SESSION_KEY);
  } catch {}
  return fallback;
}

function keepSession(value: string | null) {
  fallback = value;
  try {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

async function call<T = Record<string, unknown>>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Appwrite-Project": project };
  const session = storedSession();
  if (session) headers["X-Fallback-Cookies"] = session;
  let response: Response;
  try {
    response = await fetch(api + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new AccountError(0, "network", e instanceof Error ? e.message : String(e));
  }
  const opened = response.headers.get("X-Fallback-Cookies");
  if (opened && opened !== "[]") keepSession(opened);
  const text = await response.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {}
  if (!response.ok) {
    throw new AccountError(response.status, String(json.type ?? ""), String(json.message ?? response.statusText));
  }
  return json as T;
}

/**
 * The provider's sign-in page, which comes back to `returnTo` with userId and secret, or with
 * ?signin=failed. Appwrite only sends a sign-in back to a registered domain, so until this one is,
 * it goes to `signInReturn`, which forwards to the `to` it is given.
 */
export function signInURL(provider: Provider, returnTo: string) {
  let success = returnTo;
  if (signInReturn) {
    const relay = new URL(signInReturn);
    relay.searchParams.set("to", returnTo);
    success = relay.toString();
  }
  const failure = new URL(success);
  failure.searchParams.set("signin", "failed");
  const query = new URLSearchParams({ project, success, failure: failure.toString() });
  return `${endpoint}/account/tokens/oauth2/${provider}?${query}`;
}

/** Trade the userId and secret the provider's page came back with for a session. */
export async function finishSignIn(userId: string, secret: string) {
  await call("POST", "/account/sessions/token", { userId, secret });
}

/** Open a session for an account made with an email and a password. */
export async function signInWithEmail(email: string, password: string) {
  await call("POST", "/account/sessions/email", { email, password });
}

/** Is there a session to try? Without one there is nothing to ask Appwrite. */
export function hasSession() {
  return storedSession() !== null;
}

export async function getAccount(): Promise<Account> {
  const json = await call<Record<string, unknown>>("GET", "/account");
  const prefs = (json.prefs ?? {}) as Record<string, unknown>;
  return {
    id: String(json.$id ?? ""),
    name: String(json.name ?? ""),
    email: String(json.email ?? ""),
    createdAt: String(json.$createdAt ?? ""),
    stored: { places: countLists(prefs.favorites), searches: countLists(prefs.history), chats: countLists(prefs.chats) },
    chosenCycle: prefs.plan_cycle === "annual" || prefs.plan_cycle === "ANNUAL" ? "annual" : prefs.plan_cycle ? "monthly" : null,
  };
}

/** The account's plan; premium outranks beta. Throws when a team can't be read, as the plan is then unknown. */
export async function getPlan(account: Account): Promise<Plan> {
  const { teams = [] } = await call<{ teams?: { $id: string }[] }>("GET", "/teams");
  let beta = false;
  for (const team of teams) {
    const { memberships = [] } = await call<{ memberships?: Record<string, unknown>[] }>("GET", `/teams/${team.$id}/memberships`);
    const mine = memberships.find((m) => m.userId === account.id) ?? memberships.find((m) => account.email && m.userEmail === account.email);
    const roles = ((mine?.roles as unknown[]) ?? []).map((r) => String(r).trim().toLowerCase());
    if (roles.includes("premium")) {
      const cycle = roles.includes("annual") ? "annual" : roles.includes("monthly") ? "monthly" : account.chosenCycle;
      return { kind: "premium", cycle };
    }
    if (roles.includes("betatest")) beta = true;
  }
  return { kind: beta ? "beta" : "free", cycle: null };
}

/** The providers the account signs in with ("google", "apple"); email and password accounts have none. */
export async function listProviders(): Promise<string[]> {
  const json = await call<{ identities?: { provider?: string }[] }>("GET", "/account/identities");
  return [...new Set((json.identities ?? []).map((i) => String(i.provider ?? "")).filter(Boolean))];
}

/** The account's own deletion requests (each row is readable by its account only). */
export async function listRequests(): Promise<DeletionRequest[]> {
  const json = await call<{ rows?: Record<string, unknown>[] }>("GET", `/tablesdb/${database}/tables/${requestsTable}/rows`);
  return (json.rows ?? []).map((r) => ({ scope: r.scope === "account" ? "account" : "data", createdAt: String(r.$createdAt ?? "") }));
}

/**
 * File a deletion request, then sign out. The request row is the queue: it is written first, and nothing
 * else happens if it fails. Deleting the account then blocks it (Appwrite's PATCH /account/status), which
 * ends every session and stops it signing in again while the request is carried out. Deleting the data
 * signs out every device, so no phone uploads the lists again in the meantime.
 */
export async function requestDeletion(account: Account, scope: Scope) {
  await call("POST", `/tablesdb/${database}/tables/${requestsTable}/rows`, {
    rowId: "unique()",
    data: { user_id: account.id, scope, email: account.email },
    // Readable by its account, and changed by nobody but the project: a request can't be taken back.
    permissions: [`read("user:${account.id}")`],
  });
  // The request is in from here on, so a failure below doesn't undo it or count as one.
  try {
    if (scope === "account") await call("PATCH", "/account/status");
    else await call("DELETE", "/account/sessions");
  } catch {}
  keepSession(null);
}

export async function signOut() {
  try {
    await call("DELETE", "/account/sessions/current");
  } catch {}
  keepSession(null);
}

/** The apps keep each list as {"<region>": "<JSON array>"}; this counts the entries across regions. */
function countLists(value: unknown) {
  if (!value || typeof value !== "object") return 0;
  let n = 0;
  for (const item of Object.values(value)) {
    try {
      const list = typeof item === "string" ? JSON.parse(item) : item;
      if (Array.isArray(list)) n += list.length;
    } catch {}
  }
  return n;
}
