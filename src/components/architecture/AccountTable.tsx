function Balance({
  person,
  value,
  changing = false,
}: {
  person: 'bucky' | 'ty'
  value: number
  changing?: boolean
}) {
  return (
    <td data-testid={`${person}-balance`}>
      {changing ? (
        <span className="architecture-balance-stack">
          <span
            className="architecture-before"
            data-testid={`${person}-balance-before`}
          >
            100
          </span>
          <span
            className="architecture-after"
            data-testid={`${person}-balance-after`}
          >
            99
          </span>
        </span>
      ) : (
        value
      )}
    </td>
  )
}

export function AccountTable({
  bucky,
  ty,
  changing = false,
  showChanges = false,
  changeAmount = 1,
}: {
  bucky: number
  ty?: number
  changing?: boolean
  showChanges?: boolean
  changeAmount?: number
}) {
  return (
    <table
      className="architecture-accounts"
      aria-label="Bonsai Core account balances"
    >
      <thead>
        <tr>
          <th>Account</th>
          <th>Balance</th>
          <th className="architecture-change-heading" aria-label="Change" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Bucky 123</th>
          <Balance person="bucky" value={bucky} changing={changing} />
          <td className="architecture-change architecture-debit">
            {(changing || showChanges) && (
              <span
                className={changing ? 'architecture-after' : ''}
                data-testid="bucky-change"
              >
                −{changeAmount}
              </span>
            )}
          </td>
        </tr>
        {ty !== undefined && (
          <tr
            className={
              changing ? 'architecture-new-account architecture-after' : ''
            }
            data-testid="ty-account-row"
          >
            <th scope="row">Ty 456</th>
            <Balance person="ty" value={ty} />
            <td className="architecture-change architecture-credit">
              {(changing || showChanges) && (
                <span data-testid="ty-change">+{changeAmount}</span>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
