'use client'

import ListIcon from "@/app/icons/ListIcon";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import CloseIcon from "../icons/CloseIcon";

export default function Nav() {
  const [asideOpen, setAsideOpen] = useState(false);
  const [bgColor, setBgColor] = useState(true);

  const listenScrollEvent = () => {
    window.scrollY < 600
      ? setBgColor(false)
      : setBgColor(true)
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
        <div className="flex flex-col items-end md:hidden">
          <button onClick={() => { setAsideOpen(!asideOpen); console.log(asideOpen) }}>
            {
              asideOpen
                ? <CloseIcon />
                : <ListIcon />
            }
          </button>
          <div className={clsx(
            'grid grid-rows-[0fr] transition-all duration-300 ',
            { 'grid-rows-[1fr]': asideOpen }
          )}>
            <aside className={clsx(
              'overflow-hidden flex flex-col items-end mt-2',
              { '!grid-rows-[1fr]': asideOpen }
            )}>
              <Link className="text-xl" href="/blog">blog</Link>
              <Link className="text-xl" href="/projects">projects</Link>
            </aside>
          </div>
        </div>
        <div className="hidden md:flex gap-8">
          <Link
            className="transition-all duration-300 text-2xl border-b-2 border-t-2 border-transparent hover:border-b-black-900"
            href="/blog"
          >
            blog
          </Link>
          <Link
            className="transition-all duration-300 text-2xl border-b-2 border-t-2 border-transparent hover:border-b-black-900"
            href="/projects"
          >
            projects
          </Link>
        </div>
      </nav>
    </header>
  )
}
