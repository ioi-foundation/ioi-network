import { getAppUrl, IOI_APPS } from '@ioi/ui';
import {
  ArrowRight,
  Package2,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface SubSystem {
  url: string;
  title: string;
  description: string;
  preview: ReactNode;
}

const PreviewShell = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={`relative mt-6 w-full min-w-0 overflow-hidden rounded-tl-xl border border-white/10 bg-black shadow-[-6px_-6px_20px_-2px_rgba(59,130,246,0.12)] sm:mt-8 lg:mt-11 ${className}`}
  >
    {children}
  </div>
);

const HubPreview = () => {
  const rows = [
    { time: '13:39:24.59', status: '200', source: 'hub.ioi', action: 'Role updated' },
    { time: '13:39:24.57', status: '200', source: 'hub.ioi', action: 'Policy applied' },
    { time: '13:39:24.31', status: '200', source: 'hub.ioi', action: 'Session minted' },
  ];

  return (
    <PreviewShell className="h-[188px] bg-[radial-gradient(circle_at_12%_0%,rgba(0,111,238,0.18),transparent_34%)]">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
      <div className="relative h-full p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-zinc-400">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/80 px-4 text-zinc-500">
            <Search className="h-4 w-4 text-zinc-500" />
            <span className="truncate text-[13px] sm:text-sm">2.0M events found</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[92px_minmax(0,1fr)_108px] gap-x-3 text-[11px] uppercase tracking-[0.14em] text-zinc-500 sm:grid-cols-[112px_minmax(0,1fr)_132px]">
          <span>Time</span>
          <span>Source</span>
          <span>Action</span>
        </div>

        <div className="mt-3 space-y-3">
          {rows.map((row) => (
            <div
              key={`${row.time}-${row.action}`}
              className="grid grid-cols-[92px_minmax(0,1fr)_108px] gap-x-3 text-xs text-zinc-200 sm:grid-cols-[112px_minmax(0,1fr)_132px] sm:text-sm"
            >
              <span className="truncate font-mono text-zinc-100">{row.time}</span>
              <div className="flex min-w-0 items-center gap-2">
                <span className="rounded-md border border-emerald-700/50 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] text-emerald-400">
                  {row.status}
                </span>
                <span className="truncate text-zinc-300">{row.source}</span>
              </div>
              <span className="truncate text-zinc-100">{row.action}</span>
            </div>
          ))}
        </div>
      </div>
    </PreviewShell>
  );
};

const GovernancePreview = () => {
  const rows = [
    { label: 'Draft created', latency: '217ms', width: '66%' },
    { label: 'Execution confirmed', latency: '110ms', width: '48%' },
    { label: 'Post Published', latency: '111ms', width: '52%' },
  ];

  return (
    <PreviewShell className="h-[188px] bg-[radial-gradient(circle_at_0%_0%,rgba(0,111,238,0.2),transparent_38%)]">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
      <div className="relative h-full rounded-tl-xl border border-white/10 bg-black/80 p-5">
        <div className="text-[15px] text-zinc-400 sm:text-base">Proposal Activity</div>
        <div className="mt-5 space-y-5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-zinc-100 sm:text-[15px]">{row.label}</span>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-zinc-300 sm:text-sm">{row.latency}</span>
                <div className="flex w-14 items-center gap-1.5 sm:w-16">
                  <div className="h-px flex-1 bg-zinc-500" />
                  <div
                    className="h-2 rounded-sm bg-emerald-500/80"
                    style={{ width: row.width }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PreviewShell>
  );
};

const DocumentationPreview = () => {
  const lines = [
    'ioi-docs: build complete',
    'Pages generated: 148',
    'API references synced: 32',
    'Links validated: 100%',
    'Deploying updates... done',
  ];

  return (
    <PreviewShell className="h-[204px] bg-[radial-gradient(circle_at_15%_0%,rgba(0,111,238,0.16),transparent_34%)]">
      <div className="absolute inset-x-0 top-0 flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-white/14" />
        <span className="h-3 w-3 rounded-full bg-white/14" />
        <span className="h-3 w-3 rounded-full bg-white/14" />
      </div>
      <div className="relative h-full px-4 pb-5 pt-12 font-mono text-sm text-zinc-100">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package2 className="h-4 w-4 text-zinc-200" />
            <span className="text-zinc-300">{lines[0]}</span>
          </div>
          {lines.slice(1).map((line) => (
            <div key={line} className="text-zinc-200/95">
              {line}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>
    </PreviewShell>
  );
};

const ExplorerPreview = () => (
  <PreviewShell className="h-[200px]">
    <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-rose-500" />
        <span className="h-3 w-3 rounded-full bg-sky-500" />
        <span className="h-3 w-3 rounded-full bg-teal-500" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="h-3 w-11 rounded-full bg-zinc-800" />
        <span className="h-3 w-9 rounded-full bg-zinc-800" />
        <span className="h-3 w-14 rounded-full bg-zinc-800" />
      </div>
    </div>

    <div className="grid h-[calc(100%-52px)] grid-cols-[1.05fr_1.35fr] gap-4 p-4">
      <div className="rounded-md bg-zinc-950" />
      <div className="rounded-md bg-zinc-950" />
      <div className="col-span-2 rounded-md bg-zinc-950" />
    </div>
  </PreviewShell>
);

const StudioPreview = () => (
  <div
    aria-hidden="true"
    className="relative mt-6 h-[206px] w-full min-w-0 overflow-hidden sm:mt-8 lg:mt-11"
  >
    <div className="absolute left-0 top-0 w-[82%] rounded-tl-xl border border-white/10 bg-black px-4 py-3 shadow-[-6px_-6px_20px_-2px_rgba(59,130,246,0.12)]">
      <div className="flex items-center gap-2 text-[13px] text-zinc-400 sm:text-[15px]">
        <span>agent-studio</span>
        <span>6s ago</span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-zinc-100">
        <SlidersHorizontal className="h-4 w-4 text-zinc-300" />
        <span className="text-base leading-none sm:text-lg">updated bento box design</span>
      </div>
    </div>

    <div className="absolute left-14 top-[72px] h-10 w-0.5 rounded-full bg-cyan-400" />
    <div className="absolute left-14 top-[111px] h-0.5 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400" />
    <div className="absolute left-[118px] top-[88px] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <RotateCcw className="h-5 w-5 text-zinc-400" />
    </div>
    <div className="absolute left-[165px] top-[111px] h-0.5 w-20 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />

    <div className="absolute right-0 top-[72px] w-[56%] rounded-tl-xl border border-dashed border-white/20 bg-black/90 px-4 py-3 shadow-[-6px_-6px_20px_-2px_rgba(59,130,246,0.12)]">
      <div className="flex items-center gap-2 text-[13px] text-zinc-400 sm:text-[15px]">
        <span>agent-studio</span>
        <span>10m ago</span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-zinc-100">
        <SlidersHorizontal className="h-4 w-4 text-zinc-300" />
        <span className="text-base leading-none sm:text-lg">sandbox limits adjusted</span>
      </div>
    </div>
  </div>
);

const SubComponent = ({ subsystem }: { subsystem: SubSystem }) => {
  return (
    <article className="group flex flex-col items-start justify-between border-r border-b border-white/10 pt-6 pl-4 sm:pt-8 sm:pl-6 md:pt-10 md:pl-8 lg:pt-11 lg:pl-11">
      <div className="flex w-full min-w-0 flex-col items-start gap-1.5 font-sans">
        <p className="text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8">
          {subsystem.title}
        </p>
        <p className="max-w-sm text-base font-medium leading-[1.3] text-white/60 sm:text-lg">
          {subsystem.description}
        </p>
        <a
          href={subsystem.url}
          draggable={false}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          Open
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="w-full transition-transform duration-300 group-hover:translate-y-[-2px]">
        {subsystem.preview}
      </div>
    </article>
  );
};

export const Subsystems = () => {
  const subsystems: SubSystem[] = [
    {
      url: getAppUrl(IOI_APPS.find((a) => a.id === 'hub')!),
      title: 'IOI Hub',
      description: 'Your command center for wallets, roles, and network operations.',
      preview: <HubPreview />,
    },
    {
      url: getAppUrl(IOI_APPS.find((a) => a.id === 'governance')!),
      title: 'Governance',
      description: 'Create proposals, vote, and execute upgrades with on-chain decision flow.',
      preview: <GovernancePreview />,
    },
    {
      url: getAppUrl(IOI_APPS.find((a) => a.id === 'docs')!),
      title: 'Documentation',
      description: 'Versioned Kernel + SDK references that keep builders unblocked.',
      preview: <DocumentationPreview />,
    },
    {
      url: getAppUrl(IOI_APPS.find((a) => a.id === 'explorer')!),
      title: 'Block Explorer',
      description: 'Real-time visibility into transactions, blocks, and events with ledger views.',
      preview: <ExplorerPreview />,
    },
    {
      url: getAppUrl(IOI_APPS.find((a) => a.id === 'studio')!),
      title: 'Agent Studio',
      description: 'Underwrite, deploy, and monitor agents with policy controls & observability.',
      preview: <StudioPreview />,
    },
  ];

  return (
    <div className="grid grid-cols-1 border-l border-white/10 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col items-start justify-start gap-4 border-r border-b border-white/10 px-4 py-8 font-sans font-medium sm:gap-6 sm:px-6 sm:py-10 md:px-8 md:py-11 lg:px-12 lg:py-11">
        <p className="max-w-full text-2xl font-bold leading-8 text-white sm:max-w-[300px] sm:text-[28px] sm:leading-9 lg:text-[32px] lg:leading-10">
          Everything you need to run on IOI.
        </p>
        <p className="max-w-full text-base leading-[1.3] text-white/60 sm:max-w-[250px] sm:text-lg lg:text-xl">
          built to ship, operate, and scale with one identity and one audit trail.
        </p>
      </div>
      {subsystems.map((subsystem) => (
        <SubComponent key={subsystem.title} subsystem={subsystem} />
      ))}
    </div>
  );
};
