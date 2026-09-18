import { Coin } from '../graphics/Coin'
import './request-types.css'

function RequestCard({
  kind,
  label,
}: {
  kind: 'coins' | 'both' | 'data'
  label: string
}) {
  const hasCoins = kind !== 'data'
  const hasData = kind !== 'coins'

  return (
    <div
      className={`request-types-card request-types-kind-${kind}`}
      data-testid={`request-type-${kind}`}
    >
      <div className="request-types-art" aria-hidden="true">
        {hasCoins && <Coin kind="bonsai" size={260} />}
        {hasData && <div className="request-types-note-mark">“ ”</div>}
      </div>
      <strong className="request-types-name">{label}</strong>
      <div
        className="request-types-packet"
        aria-label={
          hasCoins
            ? hasData
              ? 'To Ty: 1 Bonsai Coin and the payload Hello, Ty'
              : 'To Ty: 1 Bonsai Coin'
            : 'To Ty: the payload Hello, Ty'
        }
      >
        <div className="request-types-recipient">
          <span>To</span>
          <strong>Ty</strong>
        </div>
        {hasCoins && (
          <div className="request-types-amount">
            <span>Amount</span>
            <strong>1</strong>
          </div>
        )}
        {hasData && (
          <div className="request-types-payload">
            <span>Payload</span>
            <strong className="request-types-data">Hello, Ty</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export function RequestTypesScene() {
  return (
    <div className="request-types-grid">
      <RequestCard kind="coins" label="Coins only" />
      <RequestCard kind="data" label="Data only" />
      <RequestCard kind="both" label="Coins + data" />
    </div>
  )
}
