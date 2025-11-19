// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { formatEther, parseEther } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import confetti from 'canvas-confetti'

const CONTRACT = '0xaf14aD8A7ee4A5CD9e286F064097A161d04EE940' as const
const GOAL = parseEther('3')

const ABI = [{"inputs":[{"internalType":"uint256","name":"goalInEther","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"goal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launched","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}] as const

export default function FunClub() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('0.1')
  const [mounted, setMounted] = useState(false)

  const { data: totalRaised = 0n } = useReadContract({ address: CONTRACT, abi: ABI, functionName: 'totalRaised' })
  const { data: launched } = useReadContract({ address: CONTRACT, abi: ABI, functionName: 'launched' })
  const { data: userContrib = 0n } = useReadContract({ address: CONTRACT, abi: ABI, functionName: 'contributions', args: [address ?? '0x0'] })
  const { writeContract, isPending } = useWriteContract()

  const progress = totalRaised ? Number(totalRaised * 100n / GOAL) : 0
  const raised = totalRaised ? Number(formatEther(totalRaised)).toFixed(3) : '0.000'

  useEffect(() => setMounted(true), [])
  useEffect(() => { if (launched && mounted) confetti({ particleCount: 1500, spread: 120, origin: { y: 0.6 } }) }, [launched, mounted])

  const contribute = () => {
    const value = parseEther(amount)
    if (value < parseEther('0.001')) return alert('Minimum 0.001 ETH')
    writeContract({ address: CONTRACT, abi: ABI, functionName: 'contribute', value })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-8xl font-black bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">FUNCLUB</h1>
          <p className="text-2xl text-gray-300 mt-6">Fair Launch on Base • Auto-launch at 3 ETH • No Presale</p>
          <div className="mt-8"><ConnectButton /></div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="text-7xl font-bold text-white">{raised} ETH</div>
            <div className="text-2xl text-gray-300">of 3 ETH goal</div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-16 mb-12 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full transition-all duration-1000 flex items-center justify-center text-3xl font-bold text-black" style={{ width: `${progress > 100 ? 100 : progress}%` }}>
              {progress >= 100 ? 'LAUNCHED!' : `${Math.floor(progress)}%`}
            </div>
          </div>

          {launched ? (
            <div className="text-center py-16">
              <h2 className="text-6xl font-bold text-green-400 mb-8">TOKEN LAUNCHED!</h2>
              {userContrib > 0n ? (
                <button onClick={() => writeContract({ address: CONTRACT, abi: ABI, functionName: 'claim' })} className="px-20 py-7 text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:scale-105 transition-all">
                  Claim Your $FUN Tokens
                </button>
              ) : <p className="text-xl text-gray-300">You didn't contribute to this launch</p>}
            </div>
          ) : (
            <>
              {userContrib > 0n ? (
                <div className="text-center py-12 bg-green-500/20 rounded-3xl">
                  <p className="text-5xl font-bold text-green-300">Thank You!</p>
                  <p className="text-3xl mt-4">You contributed {formatEther(userContrib)} ETH</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8">
                  <input type="number" step="0.001" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-80 px-8 py-6 bg-white/10 border border-white/30 rounded-2xl text-4xl text-center text-white placeholder-gray-500 focus:outline-none focus:border-pink-400" placeholder="0.1" />
                  <button onClick={contribute} disabled={isPending || !isConnected} className="px-24 py-7 text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:scale-105 transition-all disabled:opacity-50">
                    {isPending ? 'Sending...' : 'Contribute'}
                  </button>
                  <p className="text-center text-gray-400 text-lg">Min 0.001 ETH • No maximum • Auto-launch at 3 ETH</p>
                </div>
              )}
            </>
          )}

          <p className="text-center text-gray-500 text-sm mt-16">
            Contract: <a href="https://basescan.org/address/0xaf14aD8A7ee4A5CD9e286F064097A161d04EE940" target="_blank" className="underline">0xaf14...E940</a> • Powered by Base • 100% Fair
          </p>
        </div>
      </div>
    </div>
  )
}