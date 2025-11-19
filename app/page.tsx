'use client';

import { useState, useEffect } from 'react';
import { formatEther, parseEther } from 'viem';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { base } from 'wagmi/chains';
import confetti from 'canvas-confetti';
import { WalletButton } from '@/components/WalletButton';

const CONTRACT = '0xaf14aD8A7ee4A5CD9e286F064097A161d04EE940' as const;
const GOAL = parseEther('3');

const abi = [
  { name: 'totalRaised', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'contribute', type: 'function', stateMutability: 'payable', inputs: [], outputs: [] },
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: raised } = useReadContract({ address: CONTRACT, abi, functionName: 'totalRaised', chainId: base.id });
  const { writeContract } = useWriteContract();

  const progress = raised ? Number(formatEther(raised)) / 3 : 0;

  useEffect(() => {
    if (progress >= 1) confetti({ particleCount: 300, spread: 70, origin: { y: 0.6 } });
  }, [progress]);

  const contribute = () => writeContract({
    address: CONTRACT,
    abi,
    functionName: 'contribute',
    value: parseEther('0.001'),
    chainId: base.id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
        FUNCLUB
      </h1>
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-2xl w-full text-center shadow-2xl">
        <p className="text-3xl mb-8">Goal: 3 ETH → Auto Launch</p>
        <div className="text-5xl font-bold mb-6">
          {raised ? Number(formatEther(raised)).toFixed(3) : '0.000'} / 3 ETH
        </div>
        <div className="w-full bg-gray-700 rounded-full h-12 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-1000" style={{ width: `${progress * 100}%` }} />
        </div>
        
        {isConnected ? (
          <button onClick={contribute} className="bg-green-500 hover:bg-green-600 text-black text-2xl font-bold py-6 px-16 rounded-full transition">
            Contribute 0.001 ETH
          </button>
        ) : (
          <WalletButton />
        )}

        <div className="mt-12 text-sm">
          Verified Contract:{' '}
          <a href="https://basescan.org/address/0xaf14aD8A7ee4A5CD9e286F064097A161d04EE940#code" target="_blank" className="text-green-400 underline">
            0xaf14...E940
          </a>
        </div>
      </div>
    </div>
  );
}
