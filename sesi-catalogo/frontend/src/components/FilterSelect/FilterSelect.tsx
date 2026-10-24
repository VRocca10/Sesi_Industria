import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { normalizeText } from '../../utils/normalizeText'

export interface FilterOption { value: string; label: string }
interface Props { label: string; value: string; options: readonly FilterOption[]; onChange: (value: string) => void }

export function FilterSelect({ label, value, options, onChange }: Props) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const typed = useRef({ text: '', at: 0 })
  const selected = Math.max(0, options.findIndex((option) => option.value === value))

  useEffect(() => {
    if (!open) return
    function close(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])
  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  function choose(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
    button.current?.focus()
  }

  return <div ref={root} className="filter-select" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
  }}>
    <span id={`${id}-label`} className="filter-select-label">{label}</span>
    <button ref={button} type="button" role="combobox" aria-labelledby={`${id}-label`}
      aria-expanded={open} aria-controls={`${id}-list`} aria-haspopup="listbox"
      aria-activedescendant={open ? `${id}-option-${active}` : undefined}
      className="filter-select-trigger" onClick={() => { setActive(selected); setOpen(!open) }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') { setOpen(false); return }
        if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
          setOpen(true)
          setActive((current) => event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : !open ? selected : Math.max(0, Math.min(options.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1))))
          return
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (open) choose(active)
          else { setActive(selected); setOpen(true) }
          return
        }
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault()
          const now = Date.now()
          typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + event.key, at: now }
          const match = options.findIndex((option) => normalizeText(option.label).startsWith(normalizeText(typed.current.text)))
          if (match >= 0) { setActive(match); setOpen(true) }
        }
      }}>
      <span>{options[selected]?.label}</span><ChevronDown size={16} aria-hidden="true" />
    </button>
    {open && <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="filter-select-menu">
      {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value}
        className={index === active ? 'is-active' : ''} onPointerMove={() => setActive(index)}
        onPointerDown={(event) => event.preventDefault()} onClick={() => choose(index)}>
        <span>{option.label}</span>{option.value === value && <Check size={16} aria-hidden="true" />}
      </li>)}
    </ul>}
  </div>
}
