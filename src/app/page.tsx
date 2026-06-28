import Link from 'next/link'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { createClient } from '@/lib/supabase/server'

// ── Static data ────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🎯',
    title: 'El niño supera misiones',
    desc: 'Cada misión enseña un concepto de programación a través de retos visuales guiados por el robot Codi.',
  },
  {
    step: '02',
    icon: '🧠',
    title: 'Aprende poco a poco',
    desc: 'Los mundos se desbloquean de forma gradual: secuencias, bucles, condiciones, funciones e inteligencia artificial.',
  },
  {
    step: '03',
    icon: '🎮',
    title: 'Crea sus propios juegos',
    desc: 'Al dominar los conceptos, los niños construyen y comparten sus propios proyectos y mini-juegos.',
  },
  {
    step: '04',
    icon: '🏆',
    title: 'Consigue insignias y sube de nivel',
    desc: 'El progreso se guarda automáticamente. Insignias y mundos nuevos mantienen la motivación.',
  },
]

const LEVELS = [
  { emoji: '🚀', name: 'Primeros Pasos', concept: 'Secuencias e instrucciones básicas', available: true },
  { emoji: '🏝️', name: 'Isla Lógica', concept: 'Condiciones y decisiones', available: true },
  { emoji: '🌲', name: 'Bosque de Bucles', concept: 'Repetición y bucles', available: false },
  { emoji: '🏙️', name: 'Ciudad Condicional', concept: 'Lógica condicional avanzada', available: false },
  { emoji: '🤖', name: 'Laboratorio IA', concept: 'Inteligencia artificial aplicada', available: false },
  { emoji: '💻', name: 'Código Real', concept: 'TypeScript y desarrollo real', available: false },
]

const FAMILY_BENEFITS = [
  {
    icon: '🎨',
    title: 'El niño crea, no solo consume',
    desc: 'En lugar de consumir contenido pasivo, los niños construyen cosas reales: juegos, historias interactivas y proyectos propios que pueden enseñar a sus amigos.',
  },
  {
    icon: '🧩',
    title: 'Aprende a resolver problemas',
    desc: 'Cada misión entrena el pensamiento lógico y la capacidad de descomponer problemas complejos en pasos sencillos — una habilidad útil mucho más allá del código.',
  },
  {
    icon: '🛡️',
    title: 'Tú controlas su avance',
    desc: 'El adulto crea el perfil infantil y puede seguir el progreso en detalle. El niño aprende de forma autónoma sin compartir datos personales.',
  },
]

const SECURITY_ITEMS = [
  { icon: '🚫', text: 'Sin anuncios de ningún tipo' },
  { icon: '🔒', text: 'Sin venta de datos a terceros' },
  { icon: '📵', text: 'Sin email para niños — la cuenta la gestiona un adulto' },
  { icon: '💬', text: 'Sin chat libre entre usuarios' },
  { icon: '🔐', text: 'Proyectos privados por defecto' },
  { icon: '👨‍👩‍👧', text: 'El adulto puede eliminar el perfil en cualquier momento' },
]

const DONATION_AMOUNTS = ['3€', '5€', '10€', '25€']

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const hasSession = !!user

  return (
    <>
      <LandingNavbar hasSession={hasSession} />

      {/* ── HERO — único bloque que permanece oscuro ─────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-[#0d0d1a]">
        <StarryBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-white/80">
            <span>🆕</span>
            <span>100% gratuito · Sin anuncios · Sin email para niños</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
            Aprende a crear{' '}
            <span className="text-[#00B894]">juegos</span>
            <br />
            con{' '}
            <span className="text-[#a59cf0]">lógica</span>
            {' '}e{' '}
            <span className="text-[#a59cf0]">inteligencia artificial</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Una plataforma gratuita y segura para que niños y niñas de 7 a 12 años aprendan programación desde cero superando misiones gamificadas.
          </p>

          <div
            className="text-7xl md:text-8xl mb-10 select-none"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            🤖
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/registro"
              className="bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_0_40px_rgba(0,184,148,0.4)]"
            >
              ¡Empezar gratis! 🚀
            </Link>
            <a
              href="#como-funciona"
              className="border border-white/30 hover:border-white/70 text-white/80 hover:text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-200"
            >
              Ver cómo funciona ↓
            </a>
          </div>
        </div>
      </section>

      {/* A partir de aquí, todo es claro ──────────────────────────── */}
      <div className="bg-[#F8F9FF] text-[#1a1a2e]">

        {/* ── TRUST BAR ───────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#E0E0F0] py-5">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { icon: '🚫', text: 'Sin anuncios' },
                { icon: '📵', text: 'Sin email para niños' },
                { icon: '👨‍👩‍👧', text: 'El adulto controla el avance' },
                { icon: '💚', text: '100% gratuito' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 justify-center">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <span className="text-[#4a4a6a] text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CÓMO FUNCIONA ───────────────────────────────────────── */}
        <section id="como-funciona" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-[#4a4a6a] text-lg max-w-lg mx-auto">
                Aprender a programar no debería ser aburrido. Por eso lo convertimos en una aventura.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
                <div
                  key={step}
                  className="bg-white border border-[#E0E0F0] hover:border-[#534AB7]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_2px_20px_rgba(83,74,183,0.12)] group"
                >
                  <div className="text-5xl font-extrabold text-[#534AB7]/20 font-mono mb-2 leading-none group-hover:text-[#534AB7]/35 transition-colors">
                    {step}
                  </div>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-[#1a1a2e] font-bold text-sm mb-2 leading-snug">{title}</h3>
                  <p className="text-[#4a4a6a] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NIVELES ─────────────────────────────────────────────── */}
        <section id="niveles" className="py-24 px-4 bg-[#EEF0FF]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
                10 mundos de aprendizaje
              </h2>
              <p className="text-[#4a4a6a] text-lg max-w-lg mx-auto">
                Desde los primeros bloques hasta crear con inteligencia artificial real.
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0">
              {LEVELS.map(({ emoji, name, concept, available }) => (
                <div
                  key={name}
                  className={[
                    'flex-shrink-0 w-64 md:w-auto bg-white border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300',
                    available
                      ? 'border-[#534AB7]/30 hover:border-[#534AB7] hover:shadow-[0_2px_20px_rgba(83,74,183,0.15)]'
                      : 'border-[#E0E0F0] opacity-60',
                  ].join(' ')}
                >
                  <span className="text-4xl leading-none flex-shrink-0">{emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[#1a1a2e] font-bold text-sm leading-tight mb-1">{name}</p>
                    <p className="text-[#4a4a6a] text-xs leading-snug">{concept}</p>
                    {available ? (
                      <span className="inline-block mt-2 text-[10px] text-[#00B894] bg-[#00B894]/10 border border-[#00B894]/30 rounded-full px-2.5 py-0.5">
                        Disponible ahora
                      </span>
                    ) : (
                      <span className="inline-block mt-2 text-[10px] text-[#4a4a6a] bg-[#EEF0FF] rounded-full px-2.5 py-0.5">
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA FAMILIAS ───────────────────────────────────────── */}
        <section id="familias" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
                Convierte el tiempo de pantalla en{' '}
                <span className="text-[#534AB7]">aprendizaje creativo</span>
              </h2>
              <p className="text-[#4a4a6a] text-lg max-w-lg mx-auto">
                Diseñado para que los niños aprendan y los adultos estén tranquilos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-14">
              {FAMILY_BENEFITS.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-[#E0E0F0] hover:border-[#534AB7]/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_2px_16px_rgba(83,74,183,0.1)]"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-[#1a1a2e] font-bold text-base mb-2">{title}</h3>
                  <p className="text-[#4a4a6a] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 bg-[#00B894] hover:bg-[#009e7e] active:scale-95 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_2px_20px_rgba(0,184,148,0.25)]"
              >
                Crear cuenta gratis →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SEGURIDAD ───────────────────────────────────────────── */}
        <section id="seguridad" className="py-24 px-4 bg-[#EEF0FF]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-5">🔒</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Diseñado para ser seguro
            </h2>
            <p className="text-[#4a4a6a] text-lg mb-12 max-w-xl mx-auto">
              La seguridad de los niños es nuestra prioridad número uno. Estas son las reglas que no cambian nunca.
            </p>

            <div className="bg-white border border-[#E0E0F0] rounded-2xl p-8 shadow-[0_2px_12px_rgba(83,74,183,0.08)]">
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {SECURITY_ITEMS.map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <span className="text-[#4a4a6a] text-sm leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DONACIONES ──────────────────────────────────────────── */}
        <section id="donar" className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-5xl mb-5">💚</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Ayuda a mantener Misión Código gratis
            </h2>
            <p className="text-[#4a4a6a] text-lg mb-12 leading-relaxed">
              Misión Código es un proyecto independiente sin financiación externa. No vendemos datos ni ponemos anuncios. Si te parece útil, una pequeña donación ayuda a mantener los servidores y seguir añadiendo contenido.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {DONATION_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  className="border-2 border-[#534AB7]/30 hover:border-[#534AB7] hover:bg-[#EEF0FF] text-[#534AB7] font-bold text-lg px-8 py-3 rounded-xl transition-all duration-200"
                >
                  {amount}
                </button>
              ))}
            </div>

            <button className="bg-[#534AB7] hover:bg-[#4338ca] active:scale-95 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_20px_rgba(83,74,183,0.35)]">
              Donar ahora 💙
            </button>

            <p className="text-[#4a4a6a]/60 text-xs mt-6">
              Donación única · Sin compromisos · Puedes elegir el importe que quieras
            </p>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer className="border-t border-[#E0E0F0] py-14 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 font-bold text-[#1a1a2e] text-xl mb-3">
                  <span className="text-2xl">🤖</span>
                  <span>Misión Código</span>
                </div>
                <p className="text-[#4a4a6a] text-sm leading-relaxed">
                  Plataforma educativa gratuita para que niños y niñas aprendan programación mediante misiones gamificadas. Sin anuncios, sin email para niños.
                </p>
              </div>

              <div className="flex gap-14 text-sm flex-shrink-0">
                <div className="flex flex-col gap-3">
                  <p className="text-[#1a1a2e] text-xs font-semibold uppercase tracking-wider mb-1">
                    Plataforma
                  </p>
                  <a href="#como-funciona" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">Cómo funciona</a>
                  <a href="#niveles" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">Niveles</a>
                  <Link href="/registro" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">Empezar gratis</Link>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[#1a1a2e] text-xs font-semibold uppercase tracking-wider mb-1">
                    Comunidad
                  </p>
                  <a href="#familias" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">Para familias</a>
                  <a href="#seguridad" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">Seguridad</a>
                  <a href="#donar" className="text-[#4a4a6a] hover:text-[#534AB7] transition-colors">Donar</a>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E0E0F0] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#4a4a6a] text-sm">
                Hecho con ❤️ para que todos los niños puedan aprender a programar
              </p>
              <Link href="/login" className="text-[#534AB7] hover:text-[#4338ca] text-sm transition-colors font-medium">
                Iniciar sesión →
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
