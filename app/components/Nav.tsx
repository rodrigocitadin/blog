'use client'

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [bgColor, setBgColor] = useState(false);

  const listenScrollEvent = () => {
    window.scrollY >= 600
      ? setBgColor(true)
      : setBgColor(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent)
  }, [bgColor]);

  return (
    <header className={clsx(
      'z-50 fixed w-full border-b-[1px] border-b-transparent top-0 py-2 transition-all duration-300',
      { 'bg-white !border-b-light': bgColor }
    )}>
      <nav className="md:items-center items-start w-[90%] md:w-[80%] xl:w-[50%] m-auto flex justify-between">
        <Link
          className="transition-all duration-300 text-2xl border-b-2 border-t-2 border-transparent hover:border-b-black-900"
          href="/"
        >
          c.dev
        </Link>
        <Link
          className="transition-all duration-300 text-2xl border-b-2 border-t-2 border-transparent hover:border-b-black-900"
          href="/blog"
        >
          blog
        </Link>
      </nav>
    </header>
  )
}
