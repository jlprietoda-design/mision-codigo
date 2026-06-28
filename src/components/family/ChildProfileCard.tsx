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
    <div className="group bg-white border border-[#E0E0F0] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-[#534AB7]/40 hover:shadow-[0_4px_24px_rgba(83,74,183,0.12)]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#EEF0FF] mb-3">
          <span className="text-5xl leading-none">{avatar}</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">{alias}</h2>
        {ageLabel && <p className="text-[#4a4a6a] text-sm mt-0.5">{ageLabel}</p>}
      </div>

      <div className="bg-[#F8F9FF] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#534AB7]">⚡</span>
          <span className="text-[#4a4a6a]">{levelLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#00B894]">✅</span>
          <span className="text-[#4a4a6a]">{missionsText}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Link
          href={`/app/perfil/${id}`}
          className="block w-full bg-[#00B894] hover:bg-[#009e7e] text-white font-bold py-3 rounded-xl text-center transition text-sm shadow-[0_2px_10px_rgba(0,184,148,0.2)]"
        >
          ¡Continuar aventura!
        </Link>
        <Link
          href={`/app/progreso/${id}`}
          className="block w-full border border-[#534AB7]/30 hover:border-[#534AB7] hover:bg-[#EEF0FF] text-[#534AB7] font-semibold py-2.5 rounded-xl text-center transition text-sm"
        >
          Ver progreso
        </Link>
      </div>
    </div>
  )
}
