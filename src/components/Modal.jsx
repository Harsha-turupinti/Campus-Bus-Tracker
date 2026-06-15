import React from 'react'

export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 dark:bg-black/50 bg-black/30 transition-colors duration-300" onClick={onClose} />
      <div className="glass relative z-10 w-full max-w-2xl rounded-3xl p-6">{children}</div>
    </div>
  )
}
