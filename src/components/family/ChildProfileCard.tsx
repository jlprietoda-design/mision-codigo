import Link from 'next/link'

interface Props {
  id: string
  alias: string
  avatar: string
  age_range: string | null
  levelLabel: string
  completedMissions: number
}

export function ChildProfileCard({
  id,
  alias,
  avatar,
  age_range,
  levelLabel,
  completedMissions,
}: Props) {
  const ageLabel = age_range ? `${age_range} años` : null
  const missionsText =
    completedMissions === 1 ? '1 misión completada' : `${completedMissions} misiones completadas`

  return (
    <div className="group bg-[#1a1a2e] border border-[#534AB7]/50 rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-[#534AB7] hover:shadow-[0_0_30px_rgba(83,74,183,0.35)]">
      <div className="text-center">
        <div className="text-7xl leading-none mb-3">{avatar}</div>
        <h2 className="text-2xl font-bold text-white">{alias}</h2>
        {ageLabel && <p className="text-slate-400 text-sm mt-0.5">{ageLabel}</p>}
      </div>

      <div className="bg-[#0d0d1a] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#534AB7]">⚡</span>
          <span className="text-slate-300">{levelLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#00d4a1]">✅</span>
          <span className="text-slate-300">{missionsText}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Link
          href={`/app/perfil/${id}`}
          className="block w-full bg-[#00d4a1] hover:bg-[#00b88e] text-[#0d0d1a] font-bold py-3 rounded-xl text-center transition text-sm"
        >
          ¡Continuar aventura!
        </Link>
        <Link
          href={`/app/progreso/${id}`}
          className="block w-full border border-[#534AB7]/50 hover:border-[#534AB7] text-slate-300 hover:text-white font-semibold py-2.5 rounded-xl text-center transition text-sm"
        >
          Ver progreso
        </Link>
      </div>
    </div>
  )
}
