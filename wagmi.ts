import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({ projectId: '5e55da8eb85e133c7fae95aa1d081158' }),
  ],
  transports: {
    [base.id]: http(),
  },
})