// import { memo } from "react"
import DefaultGeometry from "./DefaultGeometry"

// const MemoDefaultGeometry = memo(DefaultGeometry)

export default function Nav() {
  return (
    <header className="sticky overflow-hidden bg-white z-40 top-0 border-b border-b-light">
      <nav className="*:text-3xl fixed left-1/2 -translate-x-1/2 top-0 z-50 items-start w-[90%] md:w-[80%] xl:w-[50%] flex flex-col">
        <a
          className="transition-all duration-300 border-b-2 border-t-2 border-transparent hover:border-b-black-900"
          href="/"
        >
          c.dev
        </a>
        <a
          className="transition-all duration-300 border-b-2 border-t-2 border-transparent hover:border-b-black-900"
          href="/blog"
        >
          blog
        </a>
      </nav>
      <div className="-mt-12">
        {/* <MemoDefaultGeometry /> */}
        <DefaultGeometry />
      </div>
    </header>
  )
}
