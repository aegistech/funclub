'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import confetti from 'canvas-confetti'

const CONTRACT = '0xYourDeployedAddressHere' as const  // ← chỉ sửa dòng này sau khi deploy

const ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"launched","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
] as const

export default function FunClub() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('0.1')
  const [mounted, setMounted] = useState(false)

  const { data: totalRaised = 0n } = useReadContract({ address: CONTRACT, abi: ABI, functionName: 'totalRaised' })
  const { data: launched } = useReadContract({ address: CONTRACT, abi: ABI, functionName: 'launched' })
  const { data: userContrib = 0n } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: 'contributions',
    args: [address ?? '0x0000000000000000000000000000000000000000']
  })

  const { writeContract, isPending } = useWriteContract()

  const progress = totalRaised ? Number(totalRaised * 100n / parseEther('10')) : 0
  const formattedRaised = totalRaised ? Number(formatEther(totalRaised)).toFixed(3) : '0.000'

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (launched && mounted) {
      confetti({ particleCount: 800, spread: 120, origin: { y: 0.6 } })
    }
  }, [launched, mounted])

  const contribute = () => {
    const num = parseFloat(amount)
    if (isNaN(num) || num < 0.001 || num > 10) {
      alert('Min: 0.001 ETH • Max: 1 ETH')
      return
    }
    writeContract({
      address: CONTRACT,
      abi: ABI,
      functionName: 'contribute',
      value: parseEther(amount)
    })
  }

  const claim = () => writeContract({ address: CONTRACT, abi: ABI, functionName: 'claim' })

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">

        {/* Tiêu đề + Connect Wallet */}
        <div className="text-center mb-12">
          <h1 className="text-8xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            FunClub
          </h1>
          <p className="text-2xl text-gray-300 mt-4">Raise 3 ETH → Auto Launch on Base</p>

          {/* Connect Button luôn hiện ở trên (rất rõ ràng) */}
          <div className="mt-8">
            <ConnectButton showBalance={false} />
          </div>
        </div>

        {/* Card chính */}
        <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-10 shadow-2xl">

          {/* Số ETH đã raise */}
          <div className="text-center mb-10">
            <div className="text-7xl font-bold text-white">{formattedRaised}</div>
            <div className="text-2xl text-gray-300">of 3 ETH goal</div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-14 mb-10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full transition-all duration-1000 flex items-center justify-center text-black text-2xl font-bold"
              style={{ width: `${progress > 100 ? 100 : progress}%` }}
            >
              {progress >= 100 ? 'LAUNCHED!' : `${Math.floor(progress)}%`}
            </div>
          </div>

          {/* Nội dung chính */}
          {launched ? (
            <div className="text-center py-12">
              <h2 className="text-5xl font-bold text-green-400 mb-8">TOKEN LAUNCHED!</h2>
              {userContrib > 0n ? (
                <button
                  onClick={claim}
                  disabled={isPending}
                  className="px-16 py-6 text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:scale-105 transition-all shadow-2xl"
                >
                  {isPending ? 'Claiming...' : 'Claim Your Tokens'}
                </button>
              ) : (
                <p className="text-xl text-gray-300">You didn’t contribute before launch</p>
              )}
            </div>
          ) : (
            <>
              {/* Đã contribute rồi */}
              {userContrib > 0n ? (
                <div className="text-center py-12 bg-green-500/20 rounded-3xl">
                  <h3 className="text-4xl font-bold mb-3">Thank You!</h3>
                  <p className="text-2xl">You contributed {formatEther(userContrib)} ETH</p>
                  <p className="text-gray-300 mt-4">Your tokens will be airdropped when goal is reached</p>
                </div>
              ) : (
                /* Form contribute */
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.1"
                      step="0.01"
                      className="w-64 px-8 py-6 bg-white/10 border border-white/30 rounded-2xl text-3xl text-center text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-all"
                    />
                    <button
                      onClick={contribute}
                      disabled={isPending || !isConnected}
                      className="px-16 py-6 text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:scale-105 transition-all shadow-2xl disabled:opacity-50"
                    >
                      {isPending ? 'Sending...' : 'Contribute'}
                    </button>
                  </div>
                  <p className="text-center text-gray-400">
                    Min 0.001 ETH • No maximum • Auto launch at 3 ETH
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-12 text-center text-gray-500 text-sm">
            Powered by Base
          </div>
        </div>
      </div>
    </div>
  )
}