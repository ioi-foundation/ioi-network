import { format } from 'date-fns';

export interface Block {
  height: number;
  hash: string;
  timestamp: Date;
  proposer: string;
  txCount: number;
  size: number; // in bytes
}

export interface Transaction {
  hash: string;
  type: 'transfer' | 'vote' | 'stake' | 'contract_call';
  from: string;
  to: string;
  amount: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: Date;
}

const randomHash = () => '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
const randomAddr = () => '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

export const generateBlock = (height: number): Block => ({
  height,
  hash: randomHash(),
  timestamp: new Date(),
  proposer: 'Validator-' + Math.floor(Math.random() * 100),
  txCount: Math.floor(Math.random() * 150),
  size: Math.floor(Math.random() * 2000000)
});

export const generateTx = (): Transaction => {
  const types: Transaction['type'][] = ['transfer', 'vote', 'stake', 'contract_call'];
  return {
    hash: randomHash(),
    type: types[Math.floor(Math.random() * types.length)],
    from: randomAddr(),
    to: randomAddr(),
    amount: (Math.random() * 1000).toFixed(2),
    status: Math.random() > 0.1 ? 'success' : 'failed',
    timestamp: new Date()
  };
};
