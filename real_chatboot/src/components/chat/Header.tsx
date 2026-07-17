import React from 'react'

export default function Header() {
  return (
          <header className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h2 className="text-xl font-semibold">General Chat</h2>
            <p className="text-sm text-zinc-500">
              Ask me anything
            </p>
          </div>

          <div className="rounded-lg border px-4 py-2">
            GPT-4o
          </div>
        </header>
  )
}
