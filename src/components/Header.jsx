import React from 'react'

export default function Header() {
  return (
    <div>
      <header className="flex justify-between items-center p-6 gap-4">
        <a href="/">
          <h1 className='font-semibold text-lg '><span className="text-teal-400 font-bold">ML</span> Translator</h1>
        </a>
          <a href="/" className="recBtn rounded-lg flex gap-2 items-center px-6 py-2 text-teal-400">
            <p><i className="fa-solid fa-plus text-teal-400"></i> New</p>
        </a>
      </header>
    </div>
  )
}
