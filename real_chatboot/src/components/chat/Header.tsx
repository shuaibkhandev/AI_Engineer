import React from 'react'

export default function Header() {
  return (
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 px-8 py-5 text-zinc-100 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-semibold">General Chat</h2>
            <p className="text-sm text-zinc-500">
              Ask me anything
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-md">
            GPT-4o
          </div>
        </header>
  )
}
