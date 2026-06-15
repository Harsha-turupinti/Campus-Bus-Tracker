import React from 'react'

export default function DataTable({ columns, data }) {
  return (
    <div className="glass overflow-x-auto rounded-3xl p-4">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="dark:text-slate-400 text-slate-600 uppercase text-xs tracking-widest transition-colors duration-300">
            {columns.map(column => (
              <th key={column.key} className="pb-3 px-4">{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="dark:bg-slate-900/50 bg-slate-200/30 rounded-3xl transition-colors duration-300">
              {columns.map(column => (
                <td key={column.key} className="py-3 px-4 dark:text-slate-200 text-slate-900">{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
