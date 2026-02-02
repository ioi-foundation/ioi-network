import { getAppUrl, IOI_APPS } from '@ioi/ui';
import hubImage from '../assets/sys1.svg';
import governanceImage from '../assets/sys2.svg';
import docsImage from '../assets/sys3.svg';
import explorerImage from '../assets/sys4.svg';
import studioImage from '../assets/sys5.svg';

interface SubSystem {
  url: string;
  title: string;
  description: string;
  image: string;
}

const SubComponent = ({ subsystem }: { subsystem: SubSystem }) => {
  return (
    <a href={subsystem.url} className="flex flex-col items-start justify-between border-r border-b border-white/10 pt-6 pl-4 sm:pt-8 sm:pl-6 md:pt-10 md:pl-8 lg:pt-11 lg:pl-11">
      <div className="flex flex-col items-start gap-1.5 font-sans w-full min-w-0">
        <p className="text-xl sm:text-2xl font-bold text-white leading-7 sm:leading-8">{subsystem.title}</p>
        <p className="font-medium text-base sm:text-lg text-white/60 leading-[1.3] max-w-sm">{subsystem.description}</p>
      </div>
      <img src={subsystem.image} alt={subsystem.title} className="w-full object-contain mt-6 sm:mt-8 lg:mt-11 rounded-tl-xl shadow-[-6px_-6px_20px_-2px_rgba(59,130,246,0.12)] min-w-0" />
    </a>
  );
};

export const Subsystems = () => {

  const subsystems = [
    {
      url: getAppUrl(IOI_APPS.find(a => a.id === 'hub')!),
      title: 'IOI Hub',
      description: 'Your command center for wallets, roles, and network operations.',
      image: hubImage,
    },
    {
      url: getAppUrl(IOI_APPS.find(a => a.id === 'governance')!),
      title: 'Governance',
      description: 'Create proposals, vote, and execute upgrades with on-chain decision flow.',
      image: governanceImage,
    },
    {
      url: getAppUrl(IOI_APPS.find(a => a.id === 'docs')!),
      title: 'Documentation',
      description: 'Versioned Kernel + SDK references that keep builders unblocked.',
      image: docsImage,
    },
    {
      url: getAppUrl(IOI_APPS.find(a => a.id === 'explorer')!),
      title: 'Block Explorer',
      description: 'Real-time visibility into transactions, blocks, and events with ledger views.',
      image: explorerImage,
    },
    {
      url: getAppUrl(IOI_APPS.find(a => a.id === 'studio')!),
      title: 'Agent Studio',
      description: 'Underwrite, deploy, and monitor agents with policy controls & observability.',
      image: studioImage,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-white/10">
      <div className="flex flex-col items-start justify-start font-sans font-medium gap-4 sm:gap-6 py-8 px-4 sm:py-10 sm:px-6 md:py-11 md:px-8 lg:py-11 lg:px-12 border-r border-b border-white/10">
        <p className="font-bold text-2xl sm:text-[28px] lg:text-[32px] leading-8 sm:leading-9 lg:leading-10 text-white max-w-full sm:max-w-[300px]">
          Everything you need to run on IOI.
        </p>
        <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-[1.3] max-w-full sm:max-w-[250px]">built to ship, operate, and scale with one identity and one audit trail.</p>
      </div>
      {subsystems.map((subsystem, index) => (
        <SubComponent key={index} subsystem={subsystem} />
      ))}
    </div>
  );
};