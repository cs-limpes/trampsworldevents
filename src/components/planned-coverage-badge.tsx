export function PlannedCoverageBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`planned-coverage-badge${compact ? ' planned-coverage-badge-compact' : ''}`}
      aria-label="TrampsWorld is attending this event"
      title="TrampsWorld is attending this event"
    >
      <img src="/img/scampworldsmall.png" alt="" aria-hidden="true" />
      <span aria-hidden="true">{compact ? 'TrampsWorld' : 'TrampsWorld attending'}</span>
    </span>
  )
}
