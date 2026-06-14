import { cookies } from "next/headers";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";
import {
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Clock,
  Server,
} from "lucide-react";

type HealthStatus = "Healthy" | "Degraded" | "Unhealthy";

type HealthEntry = Readonly<{
  status: HealthStatus;
  description?: string;
  duration?: string;
}>;

type HealthApiPayload =
  | HealthStatus
  | Readonly<{
      status: HealthStatus;
      totalDuration?: string;
      entries?: Readonly<Record<string, HealthEntry>>;
    }>;

type NormalizedHealth = Readonly<{
  status: HealthStatus;
  totalDuration?: string;
  entries: Readonly<Record<string, HealthEntry>>;
}>;

const normalizeHealth = (payload: HealthApiPayload): NormalizedHealth => {
  if (typeof payload === "string") {
    return { status: payload, entries: {} };
  }
  return {
    status: payload.status,
    totalDuration: payload.totalDuration,
    entries: payload.entries ?? {},
  };
};

type StatusBadgeProps = {
  status: HealthStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = {
    Healthy: {
      label: "Healthy",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ring-1 ring-emerald-500/20",
    },
    Degraded: {
      label: "Degraded",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ring-1 ring-amber-500/20",
    },
    Unhealthy: {
      label: "Unhealthy",
      className:
        "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 ring-1 ring-red-500/20",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        className,
      )}
    >
      {label}
    </span>
  );
};

type EntryRowProps = {
  name: string;
  entry: HealthEntry;
};

const EntryRow = ({ name, entry }: EntryRowProps) => {
  const isHealthy = entry.status === "Healthy";

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        {isHealthy ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground capitalize">{name}</p>
          {entry.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{entry.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {entry.duration && (
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {entry.duration}
          </span>
        )}
        <StatusBadge status={entry.status} />
      </div>
    </div>
  );
};

type DiagnosticsDict = Dictionary<"common">["diagnostics"];

type ConnectionErrorPanelProps = {
  title: string;
  detail?: string;
  status: number;
  dict: DiagnosticsDict;
};

const ConnectionErrorPanel = ({
  title,
  detail,
  status,
  dict,
}: ConnectionErrorPanelProps) => (
  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm shadow-sm">
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
        <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-base font-semibold text-red-700 dark:text-red-300">
            {dict.error.heading}
          </h2>
          {status > 0 && (
            <span className="rounded-md bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-600 dark:text-red-400 border border-red-500/20">
              HTTP {status}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {detail && (
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{detail}</p>
        )}
        <div className="mt-4 rounded-lg bg-muted/50 px-4 py-3 border border-border">
          <p className="text-xs text-muted-foreground font-mono">
            {dict.error.hint}{" "}
            <span className="text-amber-600 dark:text-amber-400">
              {process.env.API_BASE_URL ?? "API_BASE_URL não definida"}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

type SuccessPanelProps = {
  data: NormalizedHealth;
  dict: DiagnosticsDict;
};

const SuccessPanel = ({ data, dict }: SuccessPanelProps) => {
  const entryCount = Object.keys(data.entries).length;
  const serviceLabel =
    entryCount === 1 ? dict.connected.serviceCountOne : dict.connected.serviceCountMany;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
              <Wifi className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                {dict.connected.heading}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {entryCount === 0
                  ? dict.connected.noServices
                  : `${entryCount} ${serviceLabel}`}
              </p>
            </div>
          </div>
          <StatusBadge status={data.status} />
        </div>
        {data.totalDuration && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono">
              {dict.connected.duration} {data.totalDuration}
            </span>
          </div>
        )}
      </div>

      {entryCount > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-sm shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {dict.services.heading}
          </h3>
          <div className="space-y-0">
            {Object.entries(data.entries).map(([name, entry]) => (
              <EntryRow key={name} name={name} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default async function DiagnosticsPage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [result, dict] = await Promise.all([
    api.query<HealthApiPayload>("/health", { cache: "no-store" }),
    getDictionary("common", locale),
  ]);

  const { diagnostics } = dict;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {diagnostics.title}{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {diagnostics.titleHighlight}
            </span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {diagnostics.description}
          </p>
        </header>

        <div className="mb-6 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <code className="text-xs text-muted-foreground font-mono break-all">
            GET{" "}
            <span className="text-primary font-semibold">
              {process.env.API_BASE_URL ?? "API_BASE_URL não definida"}
            </span>
            /health
          </code>
        </div>

        {result.success ? (
          <SuccessPanel data={normalizeHealth(result.data)} dict={diagnostics} />
        ) : (
          <ConnectionErrorPanel
            title={result.error.title}
            detail={result.error.detail}
            status={result.status}
            dict={diagnostics}
          />
        )}

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          {diagnostics.footer}{" "}
          {new Date().toLocaleString(locale, { timeZone: "America/Sao_Paulo" })}
        </footer>
      </div>
    </div>
  );
}
