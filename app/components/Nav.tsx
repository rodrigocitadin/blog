'use client'

import DefaultGeometry from "./DefaultGeometry"

export default function Nav() {

  return (
    <header className='w-full border-b border-light top-0 bg-white'>
      <DefaultGeometry />
      <nav className="h-12 fixed -translate-x-1/2 left-1/2 top-0 z-50 md:items-center items-center w-[90%] md:w-[80%] xl:w-[50%] flex justify-between">
        <a
          className="transition-all duration-300 text-2xl border-b-2 border-t-2 border-transparent hover:border-b-black-900"
          href="/"
        >
          c.dev
        </a>
        <a
          className="transition-all duration-300 text-2xl border-b-2 border-t-2 border-transparent hover:border-b-black-900"
          href="/blog"
        >
          blog
        </a>
      </nav>
    </header>
  )
}
