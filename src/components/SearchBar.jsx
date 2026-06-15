import React from 'react'

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="glass p-3 rounded-3xl">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none dark:text-slate-100 text-slate-900 dark:placeholder:text-slate-500 placeholder:text-slate-400 transition-colors duration-300"
      />
    </div>
  )
}
