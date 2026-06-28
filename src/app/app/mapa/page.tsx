import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LEVELS, type LevelData } from '@/lib/data/levels'
import { WorldNode } from '@/components/mission/WorldNode'
import { StarryBackground } from '@/components/ui/StarryBackground'

// ──────────────────────────────────────────────────────────────
// Serpentine map layout (3 nodes per row)
//
// Visual (bottom → top):
//   Row 0 (bottom): L0 → L1 → L2          (LTR)
//   Row 1          : L5 ← L4 ← L3          (RTL, display reversed: L5,L4,L3)
//   Row 2          : L6 → L7 → L8          (LTR)
//   Row 3 (top)    :    L10 ← L9           (RTL, 2 nodes)
//
// Connectors: right-side between rows 0↔1, left-side between 1↔2,
//             right-side between 2↔3.
// ──────────────────────────────────────────────────────────────

type GridRow = (LevelData | null)[]
type ConnectorSide = 'left' | 'right'

// Each row listed bottom → top; rendered bottom-up via flex-col-reverse
const MAP_ROWS: GridRow[] = [
  [LEVELS[0], LEVELS[1], LEVELS[2]],          // bottom (LTR)
  [LEVELS[5], LEVELS[4], LEVELS[3]],          // reversed display → RTL path
  [LEVELS[6], LEVELS[7], LEVELS[8]],          // LTR
  [null, LEVELS[10], LEVELS[9]],              // top: blank col 1, RTL pair
]

// Connector that joins the END of rows[i] with the START of rows[i+1]
const CONNECTORS: ConnectorSide[] = ['right', 'left', 'right']

function HConnector({ between }: { between: [LevelData | null, LevelData | null] }) {
  const [a, b] = between
  if (!a || !b) return <div className="w-3" />
  const bothDone = a.status === 'completed' && b.status === 'completed'
  const anyActive = a.status !== 'locked' && b.status !== 'locked'
  return (
    <div
      className={[
        'h-[3px] w-8 rounded-full self-center',
        bothDone ? 'bg-[#FFD700]/70' : anyActive ? 'bg-[#534AB7]/70' : 'bg-slate-700',
      ].join(' ')}
    />
  )
}

function VConnector({ side, above, below }: {
  side: ConnectorSide
  above: LevelData | null
  below: LevelData | null
}) {
  const bothDone = above?.status === 'completed' && below?.status === 'completed'
  const anyActive =
    (above?.status ?? 'locked') !== 'locked' && (below?.status ?? 'locked') !== 'locked'

  const lineColor = bothDone
    ? 'bg-[#FFD700]/70'
    : anyActive
      ? 'bg-[#534AB7]/60'
      : 'bg-slate-700'

  return (
    <div className="grid grid-cols-3 h-8 w-full">
      {/* col 1 */}
      <div className={`flex justify-center ${side === 'left' ? '' : ''}`}>
        {side === 'left' && (
          <div className={`w-[3px] h-full rounded-full ${lineColor}`} />
        )}
      </div>
      {/* col 2 — empty */}
      <div />
      {/* col 3 */}
      <div className="flex justify-center">
        {side === 'right' && (
          <div className={`w-[3px] h-full rounded-full ${lineColor}`} />
        )}
      </div>
    </div>
  )
}

export default async function MapaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Active world for the header label
  const inProgressLevel = LEVELS.find((l) => l.status === 'in_progress') ?? LEVELS[0]

  return (
    <>
      <StarryBackground />

      <div className="relative z-10 min-h-screen bg-[#0d0d1a]/85 px-4 py-10">
        {/* Header */}
        <div className="max-w-sm mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Mapa de Mundos</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Ahora en:{' '}
            <span className="text-[#534AB7] font-semibold">
              {inProgressLevel.emoji} {inProgressLevel.title}
            </span>
          </p>
        </div>

        {/* Serpentine map */}
        <div className="max-w-sm mx-auto flex flex-col-reverse gap-0">
          {MAP_ROWS.map((row, rowIdx) => {
            // The connector that sits ABOVE this row (between rowIdx and rowIdx+1)
            const connectorAbove = rowIdx < MAP_ROWS.length - 1
              ? CONNECTORS[rowIdx]
              : null

            // Pick the node at the connector endpoint (left col for 'left', right col for 'right')
            const nextRow = connectorAbove ? MAP_ROWS[rowIdx + 1] : null
            const rowEnd = connectorAbove === 'left'
              ? (row[0] ?? row[1] ?? row[2])
              : (row[2] ?? row[1] ?? row[0])
            const nextRowStart = nextRow
              ? connectorAbove === 'left'
                ? (nextRow[0] ?? nextRow[1] ?? nextRow[2])
                : (nextRow[2] ?? nextRow[1] ?? nextRow[0])
              : null

            return (
              <div key={rowIdx}>
                {/* Vertical connector (sits ABOVE the row in visual display = below in DOM
                    because parent is flex-col-reverse) */}
                {connectorAbove && (
                  <VConnector
                    side={connectorAbove}
                    above={nextRowStart}
                    below={rowEnd}
                  />
                )}

                {/* Node row */}
                <div className="grid grid-cols-3 gap-2 items-start justify-items-center">
                  {row.map((level, colIdx) =>
                    level ? (
                      <div key={level.id} className="flex items-center gap-1">
                        <WorldNode level={level} status={level.status} />
                        {/* Horizontal connector to next node in same row */}
                        {colIdx < row.length - 1 && row[colIdx + 1] && (
                          <HConnector between={[level, row[colIdx + 1]]} />
                        )}
                      </div>
                    ) : (
                      // Empty cell — still needs space to keep grid aligned
                      <div key={`empty-${rowIdx}-${colIdx}`} className="w-[72px] h-[72px]" />
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer nav */}
        <div className="max-w-sm mx-auto mt-10 text-center">
          <Link
            href="/app/familia"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Cambiar aventurero
          </Link>
        </div>
      </div>
    </>
  )
}
