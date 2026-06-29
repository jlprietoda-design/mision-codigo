'use client'
import { useState } from 'react'

interface FaqItem { q: string; a: string }
interface Props { items: FaqItem[] }

export function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="border border-[#E0E0F0] rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-[#1a1a2e] text-sm hover:bg-[#F8F9FF] transition-colors"
          >
            <span>{item.q}</span>
            <span className={`text-[#534AB7] text-lg transition-transform duration-200 flex-shrink-0 ml-4 ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-[#4a4a6a] text-sm leading-relaxed border-t border-[#E0E0F0] pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
