'use client'

import ListIcon from "@/app/icons/ListIcon";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [asideOpen, setAsideOpen] = useState(false);

  return (
    <header className="z-50 fixed w-full top-0">
      <nav className="items-start mt-2 w-[90%] md:w-[80%] xl:w-[50%] m-auto flex justify-between">
        <Link className="text-2xl" href="/">c.dev</Link>
        <div className="flex flex-col items-end">
          <button onClick={() => { setAsideOpen(!asideOpen); console.log(asideOpen) }}>
            <ListIcon />
          </button>
          <div className={clsx(
            'grid grid-rows-[0fr] transition-all duration-500 ',
            { 'grid-rows-[1fr]': asideOpen }
          )}>
            <aside className={clsx(
              'overflow-hidden flex flex-col items-end mt-2',
              { '!grid-rows-[1fr]': asideOpen }
            )}>
              <Link href="/blog">blog</Link>
              <Link href="/projects">projects</Link>
            </aside>
          </div>
        </div>
      </nav>
    </header>
  )
}
