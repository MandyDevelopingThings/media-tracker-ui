import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Activity,
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
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ring-1 ring-emerald-500/20",
    },
    Degraded: {
      label: "Degraded",
      className:
        "bg-amber-500/10 text-amber-400 border border-amber-500/20 ring-1 ring-amber-500/20",
    },
    Unhealthy: {
      label: "Unhealthy",
      className:
        "bg-red-500/10 text-red-400 border border-red-500/20 ring-1 ring-red-500/20",
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
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        {isHealthy ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-red-400" />
        )}
        <div>
          <p className="text-sm font-medium text-white capitalize">{name}</p>
          {entry.description && (
            <p className="text-xs text-white/40 mt-0.5">{entry.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {entry.duration && (
          <span className="text-xs text-white/30 font-mono tabular-nums">
            {entry.duration}
          </span>
        )}
        <StatusBadge status={entry.status} />
      </div>
    </div>
  );
};

type ConnectionErrorPanelProps = {
  title: string;
  detail?: string;
  status: number;
};

const ConnectionErrorPanel = ({
  title,
  detail,
  status,
}: ConnectionErrorPanelProps) => (
  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm">
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
        <WifiOff className="h-5 w-5 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-base font-semibold text-red-300">
            Falha na Conexão
          </h2>
          {status > 0 && (
            <span className="rounded-md bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-400 border border-red-500/20">
              HTTP {status}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-white/70">{title}</p>
        {detail && (
          <p className="mt-2 text-xs text-white/40 leading-relaxed">{detail}</p>
        )}
        <div className="mt-4 rounded-lg bg-black/30 px-4 py-3 border border-white/5">
          <p className="text-xs text-white/40 font-mono">
            Verifique se a API C# está rodando em{" "}
            <span className="text-amber-400">
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
};

const SuccessPanel = ({ data }: SuccessPanelProps) => {
  const entryCount = Object.keys(data.entries).length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
              <Wifi className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                API Conectada
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                {entryCount === 0
                  ? "Nenhum serviço detalhado"
                  : `${entryCount} ${entryCount === 1 ? "serviço monitorado" : "serviços monitorados"}`}
              </p>
            </div>
          </div>
          <StatusBadge status={data.status} />
        </div>
        {data.totalDuration && (
          <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono">Duração total: {data.totalDuration}</span>
          </div>
        )}
      </div>

      {entryCount > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
            Serviços
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
  const result = await api.query<HealthApiPayload>("/health", {
    cache: "no-store",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-indigo-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Activity className="h-5 w-5 text-violet-400" />
            </div>
            <span className="text-sm font-medium text-white/40 tracking-wide uppercase">
              MediaTracker
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Diagnóstico de{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Infraestrutura
            </span>
          </h1>
          <p className="mt-3 text-sm text-white/40 leading-relaxed">
            Este painel verifica a conectividade entre o servidor Next.js e a
            API C# em tempo real, diretamente no servidor — sem passar pelo
            browser.
          </p>
        </header>

        <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <Server className="h-3.5 w-3.5 text-white/25 shrink-0" />
          <code className="text-xs text-white/30 font-mono break-all">
            GET{" "}
            <span className="text-violet-400">
              {process.env.API_BASE_URL ?? "API_BASE_URL não definida"}
            </span>
            /health
          </code>
        </div>

        {result.success ? (
          <SuccessPanel data={normalizeHealth(result.data)} />
        ) : (
          <ConnectionErrorPanel
            title={result.error.title}
            detail={result.error.detail}
            status={result.status}
          />
        )}

        <footer className="mt-10 text-center text-xs text-white/20">
          Renderizado no servidor em{" "}
          {new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
        </footer>
      </div>
    </div>
  );
}
