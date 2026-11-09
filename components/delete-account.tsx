"use client";

import { useEffect, useRef, useState } from "react";
import { AppleLogo, CheckCircle, GoogleLogo, GooglePlayLogo, SignOut, Trash, Warning } from "@phosphor-icons/react";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/content/i18n";
import { site } from "@/content/site";
import {
  AccountError,
  finishSignIn,
  getAccount,
  getBilling,
  getPlan,
  hasSession,
  listProviders,
  listRequests,
  requestDeletion,
  signInURL,
  signInWithEmail,
  signOut,
  storeSubscriptions,
  type Account,
  type Billing,
  type DeletionRequest,
  type Plan,
  type Provider,
  type Scope,
} from "@/lib/account";
import { button, fill } from "./ui";

type T = Dictionary["deletion"];

type State =
  | { phase: "loading" }
  | { phase: "signedOut"; error?: string }
  | {
      phase: "signedIn";
      account: Account;
      plan: Plan | null;
      billing: Billing | null;
      providers: string[];
      requests: DeletionRequest[];
    }
  | { phase: "done"; scope: Scope };

const card = "rounded-[24px] bg-surface p-6 shadow-[inset_0_0_0_1px_var(--line)] sm:p-8";
const danger =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[12px] bg-alert px-5 text-[15px] font-semibold text-white transition-[filter,transform] duration-200 ease-brand hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100 disabled:active:scale-100";
const dangerOutline =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[12px] px-5 text-[15px] font-semibold text-alert shadow-[inset_0_0_0_1px_var(--alert)] transition-colors duration-200 hover:bg-alert/8";

/**
 * What a Premium subscription means for deleting the account: nothing (no Premium, granted by hand, or
 * already cancelled), "blocked" while the store says it still renews, and "confirm" when the stores
 * couldn't be asked, so the visitor says they've cancelled it.
 */
function subscriptionGate(plan: Plan | null, billing: Billing | null): "none" | "blocked" | "confirm" {
  const premium = billing ? billing.premium : plan?.kind === "premium";
  if (!premium) return "none";
  if (billing && (billing.source === null || billing.willRenew === false)) return "none";
  return billing?.willRenew === true ? "blocked" : "confirm";
}

/** Arabic dates keep Latin digits, as the rest of the site does. */
function formatDate(iso: string | number, locale: Locale) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : locale, { dateStyle: "long" }).format(date);
}

export function DeleteAccount({ t, locale }: { t: T; locale: Locale }) {
  const [state, setState] = useState<State>({ phase: "loading" });
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Scope | null>(null);
  const gate = state.phase === "signedIn" ? subscriptionGate(state.plan, state.billing) : "none";

  async function load() {
    const account = await getAccount();
    const [plan, billing, providers, requests] = await Promise.all([
      getPlan(account).catch(() => null),
      getBilling().catch(() => null),
      listProviders().catch(() => []),
      listRequests().catch(() => []),
    ]);
    setState({ phase: "signedIn", account, plan, billing, providers, requests });
  }

  // Coming back from the provider's page: trade the query for a session and tidy the address bar.
  useEffect(() => {
    const url = new URL(window.location.href);
    setReturnTo(url.origin + url.pathname);
    const userId = url.searchParams.get("userId");
    const secret = url.searchParams.get("secret");
    const failed = url.searchParams.get("signin") === "failed";
    if (userId || secret || failed) window.history.replaceState(null, "", url.pathname);

    (async () => {
      try {
        if (failed) return setState({ phase: "signedOut", error: t.signInFailed });
        if (userId && secret) {
          await finishSignIn(userId, secret);
          await load();
        } else if (hasSession()) {
          await load();
        } else {
          setState({ phase: "signedOut" });
        }
      } catch (e) {
        const error = e instanceof AccountError ? e : new AccountError(0, "", String(e));
        if (error.type === "user_blocked") setState({ phase: "signedOut", error: t.blocked });
        else if (error.unauthorized) setState({ phase: "signedOut", error: userId ? t.signInFailed : undefined });
        else setState({ phase: "signedOut", error: t.unavailable });
      }
    })();
    // Runs once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-balance text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          {t.title}
        </h1>
        {state.phase !== "done" && <p className="max-w-[60ch] text-lg leading-relaxed text-ink-2">{t.intro}</p>}
      </div>

      {state.phase === "loading" && (
        <p className="text-ink-3" role="status">
          {t.signingIn}
        </p>
      )}

      {state.phase === "signedOut" && (
        <SignIn
          t={t}
          returnTo={returnTo}
          error={state.error}
          onEmail={async (email, password) => {
            try {
              await signInWithEmail(email, password);
              await load();
            } catch (e) {
              const error = e instanceof AccountError ? e : new AccountError(0, "", String(e));
              const message =
                error.type === "user_blocked"
                  ? t.blocked
                  : error.type === "user_invalid_credentials" || error.code === 400
                    ? t.wrongPassword
                    : t.unavailable;
              setState({ phase: "signedOut", error: message });
            }
          }}
        />
      )}

      {state.phase === "signedIn" && (
        <>
          <AccountCard
            t={t}
            locale={locale}
            account={state.account}
            plan={state.plan}
            billing={state.billing}
            providers={state.providers}
            onSignOut={async () => {
              await signOut();
              setState({ phase: "signedOut" });
            }}
          />
          {state.requests.map((r) => (
            <p key={r.createdAt + r.scope} role="status" className="rounded-[12px] bg-surface-2 px-4 py-3 text-[15px] text-ink-2">
              {fill(t.pending, {
                date: formatDate(r.createdAt, locale),
                what: r.scope === "account" ? t.pendingAccount : t.pendingData,
              })}
            </p>
          ))}
          <div className="grid gap-4 md:grid-cols-2">
            <ActionCard title={t.dataTitle} body={t.dataBody} button={t.dataTitle} onClick={() => setConfirming("data")} />
            <ActionCard
              title={t.accountDeleteTitle}
              body={t.accountBody}
              note={{ none: t.storeNote, blocked: t.mustCancel, confirm: t.premiumFirst }[gate]}
              button={t.accountDeleteTitle}
              strong
              disabled={gate === "blocked"}
              onClick={() => setConfirming("account")}
            />
          </div>
          <p className="text-[15px] leading-relaxed text-ink-3">{t.phoneNote}</p>
          {confirming && (
            <ConfirmDialog
              t={t}
              locale={locale}
              scope={confirming}
              account={state.account}
              premium={gate === "confirm"}
              onCancel={() => setConfirming(null)}
              onDone={() => {
                setConfirming(null);
                setState({ phase: "done", scope: confirming });
              }}
            />
          )}
        </>
      )}

      {state.phase === "done" && (
        <div className={`${card} flex flex-col items-start gap-4`} role="status">
          <CheckCircle size={40} weight="fill" className="text-route-deep dark:text-route" aria-hidden />
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {state.scope === "account" ? t.done.accountTitle : t.done.dataTitle}
          </h2>
          <p className="max-w-[56ch] text-lg leading-relaxed text-ink-2">
            {state.scope === "account" ? t.done.accountBody : t.done.dataBody}
          </p>
          <a href={`/${locale}/`} className={`${button.secondary} mt-2`}>
            {t.done.home}
          </a>
        </div>
      )}
    </div>
  );
}

const field =
  "h-12 rounded-[12px] bg-canvas px-4 text-ink shadow-[inset_0_0_0_1px_var(--line-2)] outline-none focus:shadow-[inset_0_0_0_2px_var(--signal)]";

function SignIn({
  t,
  returnTo,
  error,
  onEmail,
}: {
  t: T;
  returnTo: string | null;
  error?: string;
  onEmail: (email: string, password: string) => Promise<void>;
}) {
  const href = (provider: Provider) => (returnTo ? signInURL(provider, returnTo) : undefined);
  const [busy, setBusy] = useState(false);
  return (
    <section aria-labelledby="signin-title" className={`${card} flex flex-col gap-5`}>
      <h2 id="signin-title" className="text-xl font-semibold text-ink">
        {t.signInTitle}
      </h2>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-[12px] bg-alert/10 px-4 py-3 text-[15px] text-alert">
          <Warning size={20} weight="bold" className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={href("google")} className={`${button.secondary} sm:flex-1`}>
          <GoogleLogo size={20} weight="bold" aria-hidden />
          {t.google}
        </a>
        <a
          href={href("apple")}
          className={`${button.secondary} !bg-[#000] !text-white !shadow-none hover:!bg-[#1f1f1f] dark:!bg-white dark:!text-black dark:hover:!bg-[#e8e8e8] sm:flex-1`}
        >
          <AppleLogo size={20} weight="fill" aria-hidden />
          {t.apple}
        </a>
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-3">
        <span className="h-px flex-1 bg-line-2" />
        {t.or}
        <span className="h-px flex-1 bg-line-2" />
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setBusy(true);
          await onEmail(String(data.get("email") ?? "").trim(), String(data.get("password") ?? ""));
          setBusy(false);
        }}
      >
        <label className="flex flex-col gap-2 text-[15px] text-ink-2">
          {t.emailLabel}
          <input name="email" type="email" required autoComplete="email" dir="ltr" className={field} />
        </label>
        <label className="flex flex-col gap-2 text-[15px] text-ink-2">
          {t.passwordLabel}
          <input name="password" type="password" required autoComplete="current-password" dir="ltr" className={field} />
        </label>
        <button type="submit" disabled={busy} className={`${button.primary} self-start disabled:opacity-60`}>
          {busy ? t.signingIn : t.emailSubmit}
        </button>
      </form>
      {site.contactEmail && (
        <p className="text-[15px] leading-relaxed text-ink-3">{fill(t.forgot, { email: site.contactEmail })}</p>
      )}
    </section>
  );
}

function AccountCard({
  t,
  locale,
  account,
  plan,
  billing,
  providers,
  onSignOut,
}: {
  t: T;
  locale: Locale;
  account: Account;
  plan: Plan | null;
  billing: Billing | null;
  providers: string[];
  onSignOut: () => void;
}) {
  const comma = locale === "ar" ? "، " : ", ";
  // The stores' answer wins over the membership: it has just been checked.
  const premium = billing ? billing.premium : plan?.kind === "premium";
  const kind = premium ? "premium" : plan?.kind === "beta" ? "beta" : plan || billing ? "free" : null;
  const cycle = billing?.cycle ?? plan?.cycle ?? null;
  const planText = !kind ? t.planUnknown : [t.plans[kind], premium && cycle ? t.cycles[cycle] : ""].filter(Boolean).join(comma);
  const renewal =
    !premium || !billing?.source || billing.willRenew === null
      ? ""
      : billing.willRenew
        ? billing.expiresAt
          ? fill(t.renewsOn, { date: formatDate(billing.expiresAt, locale) })
          : t.renews
        : billing.expiresAt
          ? fill(t.endsOn, { date: formatDate(billing.expiresAt, locale) })
          : "";
  // A plan granted by hand in the console has no store to manage it in.
  const stores = !premium || (billing && !billing.source) ? [] : billing?.source ? [billing.source] : (["app_store", "play"] as const);
  const rows: [string, string][] = [
    [t.name, account.name],
    [t.email, account.email],
    [t.method, providers.map((p) => t.providers[p] ?? p).join(comma)],
    [t.plan, planText],
    [t.subscription, renewal],
    [t.created, formatDate(account.createdAt, locale)],
    [t.id, account.id],
  ];
  const stored: [string, number][] = [
    [t.places, account.stored.places],
    [t.searches, account.stored.searches],
    [t.chats, account.stored.chats],
  ];
  return (
    <section aria-labelledby="account-title" className={`${card} flex flex-col gap-6`}>
      <div className="flex items-center justify-between gap-4">
        <h2 id="account-title" className="text-xl font-semibold text-ink">
          {t.accountTitle}
        </h2>
        <button type="button" onClick={onSignOut} className={`${button.secondary} !h-10 !px-4`}>
          <SignOut size={18} aria-hidden className="rtl:-scale-x-100" />
          {t.signOut}
        </button>
      </div>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-[15px] text-ink-3">{label}</dt>
              <dd className="break-all text-[15px] text-ink">
                <bdi>{value}</bdi>
              </dd>
            </div>
          ))}
      </dl>
      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <h3 className="text-[13px] font-semibold text-ink-3">{t.storedTitle}</h3>
        <ul className="grid gap-3 sm:grid-cols-3">
          {stored.map(([label, n]) => (
            <li key={label} className="flex flex-col gap-0.5 rounded-[12px] bg-surface-2 px-4 py-3">
              <span className="font-mono text-2xl font-medium text-ink">{n}</span>
              <span className="text-sm text-ink-2">{label}</span>
            </li>
          ))}
        </ul>
      </div>
      {stores.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <h3 className="text-[13px] font-semibold text-ink-3">{t.manageTitle}</h3>
          <p className="text-[15px] leading-relaxed text-ink-2">{t.manageBody}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {stores.map((store) => (
              <a
                key={store}
                href={(stores.length === 1 && billing?.manageUrl) || (store === "app_store" ? storeSubscriptions.appStore : storeSubscriptions.googlePlay)}
                target="_blank"
                rel="noopener"
                className={`${button.secondary} sm:flex-1`}
              >
                {store === "app_store" ? <AppleLogo size={20} weight="fill" aria-hidden /> : <GooglePlayLogo size={20} weight="fill" aria-hidden />}
                {store === "app_store" ? t.appStore : t.googlePlay}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ActionCard({
  title,
  body,
  note,
  button: label,
  strong = false,
  disabled = false,
  onClick,
}: {
  title: string;
  body: string;
  note?: string;
  button: string;
  strong?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <section className={`${card} flex flex-col gap-3 ${strong ? "shadow-[inset_0_0_0_1px_var(--alert)]" : ""}`}>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="text-[15px] leading-relaxed text-ink-2">{body}</p>
      {note && <p className="text-[15px] font-medium leading-relaxed text-ink">{note}</p>}
      <button type="button" onClick={onClick} disabled={disabled} className={`${strong ? danger : dangerOutline} mt-auto self-start`}>
        <Trash size={18} weight="bold" aria-hidden />
        {label}
      </button>
    </section>
  );
}

function ConfirmDialog({
  t,
  locale,
  scope,
  account,
  premium,
  onCancel,
  onDone,
}: {
  t: T;
  locale: Locale;
  scope: Scope;
  account: Account;
  /** A Premium account confirms the subscription is cancelled before the account can go. */
  premium: boolean;
  onCancel: () => void;
  onDone: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [ack, setAck] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const isAccount = scope === "account";
  const needsCancel = isAccount && premium;
  const word = t.confirm.word;
  const matches = typed.trim().toLocaleUpperCase(locale) === word.toLocaleUpperCase(locale);
  const ready = ack && matches && (!needsCancel || cancelled) && !busy;

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function submit() {
    if (!ready) return;
    setBusy(true);
    setFailed(false);
    try {
      await requestDeletion(account, scope);
      onDone();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        if (busy) e.preventDefault();
      }}
      onClose={onCancel}
      className="m-auto w-[calc(100%-32px)] max-w-[520px] rounded-[24px] bg-surface p-0 text-ink shadow-[0_24px_64px_rgb(var(--shadow-tint)/0.28)] backdrop:bg-[rgb(7_20_9/0.6)]"
    >
      <form
        method="dialog"
        className="flex flex-col gap-5 p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-alert/12 text-alert">
            <Warning size={22} weight="bold" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="confirm-title" className="text-xl font-semibold text-ink">
              {isAccount ? t.confirm.accountTitle : t.confirm.dataTitle}
            </h2>
            <p className="font-semibold text-alert">{t.confirm.irreversible}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-2">
          <p>{isAccount ? t.accountBody : t.dataBody}</p>
          <p>{t.confirm.signOut}</p>
          {isAccount && <p className="font-medium text-ink">{premium ? t.premiumFirst : t.storeNote}</p>}
        </div>

        {needsCancel && (
          <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-surface-2 px-4 py-3 text-[15px] text-ink">
            <input
              type="checkbox"
              checked={cancelled}
              onChange={(e) => setCancelled(e.target.checked)}
              disabled={busy}
              className="mt-0.5 size-5 shrink-0 accent-[var(--alert)]"
            />
            {t.confirm.cancelled}
          </label>
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-surface-2 px-4 py-3 text-[15px] text-ink">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            disabled={busy}
            className="mt-0.5 size-5 shrink-0 accent-[var(--alert)]"
          />
          {t.confirm.ack}
        </label>

        <label className="flex flex-col gap-2 text-[15px] text-ink-2">
          {fill(t.confirm.type, { word })}
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={busy}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="h-12 rounded-[12px] bg-canvas px-4 text-ink shadow-[inset_0_0_0_1px_var(--line-2)] outline-none focus:shadow-[inset_0_0_0_2px_var(--alert)]"
          />
        </label>

        {failed && (
          <p role="alert" className="rounded-[12px] bg-alert/10 px-4 py-3 text-[15px] text-alert">
            {t.confirm.failed}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => ref.current?.close()} disabled={busy} className={button.secondary}>
            {t.confirm.cancel}
          </button>
          <button type="submit" disabled={!ready} className={danger}>
            <Trash size={18} weight="bold" aria-hidden />
            {busy ? t.confirm.working : isAccount ? t.confirm.account : t.confirm.data}
          </button>
        </div>
      </form>
    </dialog>
  );
}
