import Link from 'next/link'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { StarryBackground } from '@/components/ui/StarryBackground'

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

export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      <div className="bg-[#0d0d1a] text-white">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <StarryBackground />

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#534AB7]/15 border border-[#534AB7]/35 rounded-full px-4 py-2 mb-8 text-sm text-[#a59cf0]">
              <span>🆕</span>
              <span>100% gratuito · Sin anuncios · Sin email para niños</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
              Aprende a crear{' '}
              <span className="text-[#00d4a1]">juegos</span>
              <br />
              con{' '}
              <span className="text-[#534AB7]">lógica</span>
              {' '}e{' '}
              <span className="text-[#534AB7]">inteligencia artificial</span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Una plataforma gratuita y segura para que niños y niñas de 7 a 12 años aprendan programación desde cero superando misiones gamificadas.
            </p>

            {/* Floating robot */}
            <div
              className="text-7xl md:text-8xl mb-10 select-none"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              🤖
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registro"
                className="bg-[#00d4a1] hover:bg-[#00b88e] active:scale-95 text-[#0d0d1a] font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_0_50px_rgba(0,212,161,0.35)]"
              >
                ¡Empezar gratis! 🚀
              </Link>
              <a
                href="#como-funciona"
                className="border border-[#534AB7]/50 hover:border-[#534AB7] text-slate-300 hover:text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-200"
              >
                Ver cómo funciona ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
        <div className="bg-[#0f111e] border-y border-[#534AB7]/15 py-5">
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
                  <span className="text-slate-300 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────── */}
        <section id="como-funciona" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                Aprender a programar no debería ser aburrido. Por eso lo convertimos en una aventura.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
                <div
                  key={step}
                  className="bg-[#0f111e] border border-[#534AB7]/20 hover:border-[#534AB7]/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(83,74,183,0.12)] group"
                >
                  <div className="text-5xl font-extrabold text-[#534AB7]/25 font-mono mb-2 leading-none group-hover:text-[#534AB7]/40 transition-colors">
                    {step}
                  </div>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-white font-bold text-sm mb-2 leading-snug">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NIVELES ───────────────────────────────────────────────────── */}
        <section id="niveles" className="py-24 px-4 bg-[#0a0a18]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                10 mundos de aprendizaje
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                Desde los primeros bloques hasta crear con inteligencia artificial real.
              </p>
            </div>

            {/* Horizontal scroll on mobile, 3-col grid on desktop */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0">
              {LEVELS.map(({ emoji, name, concept, available }) => (
                <div
                  key={name}
                  className={[
                    'flex-shrink-0 w-64 md:w-auto bg-[#0f111e] border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300',
                    available
                      ? 'border-[#534AB7]/45 hover:border-[#534AB7] hover:shadow-[0_0_25px_rgba(83,74,183,0.18)]'
                      : 'border-[#534AB7]/12 opacity-55',
                  ].join(' ')}
                >
                  <span className="text-4xl leading-none flex-shrink-0">{emoji}</span>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm leading-tight mb-1">{name}</p>
                    <p className="text-slate-400 text-xs leading-snug">{concept}</p>
                    {available ? (
                      <span className="inline-block mt-2 text-[10px] text-[#00d4a1] bg-[#00d4a1]/10 border border-[#00d4a1]/25 rounded-full px-2.5 py-0.5">
                        Disponible ahora
                      </span>
                    ) : (
                      <span className="inline-block mt-2 text-[10px] text-slate-600 bg-[#1a1a2e] rounded-full px-2.5 py-0.5">
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA FAMILIAS ─────────────────────────────────────────────── */}
        <section id="familias" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Convierte el tiempo de pantalla en{' '}
                <span className="text-[#00d4a1]">aprendizaje creativo</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                Diseñado para que los niños aprendan y los adultos estén tranquilos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-14">
              {FAMILY_BENEFITS.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0f111e] border border-[#534AB7]/20 hover:border-[#534AB7]/45 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 bg-[#00d4a1] hover:bg-[#00b88e] active:scale-95 text-[#0d0d1a] font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-[0_0_40px_rgba(0,212,161,0.25)]"
              >
                Crear cuenta gratis →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SEGURIDAD ─────────────────────────────────────────────────── */}
        <section id="seguridad" className="py-24 px-4 bg-[#0a0a18]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-5">🔒</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Diseñado para ser seguro
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              La seguridad de los niños es nuestra prioridad número uno. Estas son las reglas que no cambian nunca.
            </p>

            <div className="bg-[#0f111e] border border-[#534AB7]/20 rounded-2xl p-8">
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {SECURITY_ITEMS.map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DONACIONES ────────────────────────────────────────────────── */}
        <section id="donar" className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-5xl mb-5">💚</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ayuda a mantener Misión Código gratis
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              Misión Código es un proyecto independiente sin financiación externa. No vendemos datos ni ponemos anuncios. Si te parece útil, una pequeña donación ayuda a mantener los servidores y seguir añadiendo contenido.
            </p>

            {/* Amount selector — visual only, pending payment integration */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {DONATION_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  className="border-2 border-[#534AB7]/45 hover:border-[#534AB7] hover:bg-[#534AB7]/10 text-white font-bold text-lg px-8 py-3 rounded-xl transition-all duration-200"
                >
                  {amount}
                </button>
              ))}
            </div>

            <button className="bg-[#534AB7] hover:bg-[#4338ca] active:scale-95 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(83,74,183,0.4)]">
              Donar ahora 💙
            </button>

            <p className="text-slate-600 text-xs mt-6">
              Donación única · Sin compromisos · Puedes elegir el importe que quieras
            </p>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer className="border-t border-[#534AB7]/15 py-14 px-4 bg-[#09090f]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
              {/* Brand */}
              <div className="max-w-xs">
                <div className="flex items-center gap-2 font-bold text-white text-xl mb-3">
                  <span className="text-2xl">🤖</span>
                  <span>Misión Código</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Plataforma educativa gratuita para que niños y niñas aprendan programación mediante misiones gamificadas. Sin anuncios, sin email para niños.
                </p>
              </div>

              {/* Links */}
              <div className="flex gap-14 text-sm flex-shrink-0">
                <div className="flex flex-col gap-3">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Plataforma
                  </p>
                  <a href="#como-funciona" className="text-slate-400 hover:text-white transition-colors">
                    Cómo funciona
                  </a>
                  <a href="#niveles" className="text-slate-400 hover:text-white transition-colors">
                    Niveles
                  </a>
                  <Link href="/registro" className="text-slate-400 hover:text-white transition-colors">
                    Empezar gratis
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Comunidad
                  </p>
                  <a href="#familias" className="text-slate-400 hover:text-white transition-colors">
                    Para familias
                  </a>
                  <a href="#seguridad" className="text-slate-400 hover:text-white transition-colors">
                    Seguridad
                  </a>
                  <a href="#donar" className="text-slate-400 hover:text-white transition-colors">
                    Donar
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-[#534AB7]/12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-slate-600 text-sm">
                Hecho con ❤️ para que todos los niños puedan aprender a programar
              </p>
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-400 text-sm transition-colors"
              >
                Iniciar sesión →
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
