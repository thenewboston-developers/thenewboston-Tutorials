import { ServerIllustration } from './ServerIllustration'
import './bitcoin-node.css'

export function BitcoinNode({ className = '' }: { className?: string }) {
  return (
    <div
      className={`architecture-bitcoin-node ${className}`}
      data-testid="bitcoin-node"
    >
      <strong>Bitcoin node</strong>
      <div className="architecture-bitcoin-node-picture">
        <ServerIllustration currency="bitcoin" />
      </div>
    </div>
  )
}
