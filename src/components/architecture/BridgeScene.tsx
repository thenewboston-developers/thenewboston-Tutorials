import { Coin } from '../graphics/Coin'
import { CoreServer } from './ArchitecturePrimitives'
import { BridgeServer } from './BridgeServer'
import { Laptop } from './Laptop'
import './bridge.css'

export function BridgeScene() {
  return (
    <div className="architecture-bridge-demo" data-testid="bridge-demo">
      <svg
        className="architecture-connection-wires architecture-bridge-wires"
        viewBox="0 0 2560 1440"
        aria-hidden="true"
      >
        <path
          className="architecture-bridge-client-wire"
          data-from="client"
          data-to="bridge"
          d="M1034 756C1120 756 1150 836 1233 836"
        />
        <path
          data-from="bridge"
          data-to="bonsai"
          d="M1620 740C1810 740 1770 301 1985 301"
        />
        <path
          className="architecture-bridge-coffee-wire"
          data-from="bridge"
          data-to="coffee"
          d="M1620 810C1780 810 1800 761 1985 761"
        />
        <path
          className="architecture-bridge-tuna-wire"
          data-from="bridge"
          data-to="tuna"
          d="M1620 880C1800 880 1750 1221 1985 1221"
        />
      </svg>

      <Laptop name="Bucky" className="architecture-bridge-client">
        <div className="architecture-bridge-app">
          <section className="architecture-bridge-feature architecture-bridge-social">
            <h3>Social post</h3>
            <div className="architecture-bridge-post">
              <strong>Bucky</strong>
              <p>New growth on my bonsai.</p>
            </div>
            <div className="architecture-bridge-tips">
              <span>Tips received</span>
              <div>
                <span>
                  <Coin kind="bonsai" size={34} />
                  +1
                </span>
                <span>
                  <Coin kind="coffee" size={34} />
                  +5
                </span>
                <span>
                  <Coin kind="tuna" size={34} />
                  +2
                </span>
              </div>
            </div>
          </section>
          <section className="architecture-bridge-feature">
            <h3>Trade</h3>
            <div className="architecture-bridge-trade-field">
              <span>You give</span>
              <div>
                <Coin kind="bonsai" size={37} />
                <strong>1 Bonsai</strong>
              </div>
            </div>
            <div className="architecture-bridge-trade-field">
              <span>You receive</span>
              <div>
                <Coin kind="coffee" size={37} />
                <strong>20 Coffee</strong>
              </div>
            </div>
            <div className="architecture-bridge-trade-action">Trade</div>
          </section>
        </div>
      </Laptop>

      <BridgeServer className="architecture-bridge-hub" />

      {(['bonsai', 'coffee', 'tuna'] as const).map((currency) => (
        <div
          key={currency}
          className={`architecture-bridge-core architecture-bridge-core-${currency}`}
        >
          <CoreServer currency={currency} />
        </div>
      ))}
    </div>
  )
}
