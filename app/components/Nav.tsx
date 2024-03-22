import ListIcon from "@/app/icons/ListIcon";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="z-50 fixed w-full top-0">
      <nav className="items-center mt-2 w-[90%] md:w-[80%] xl:w-[50%] m-auto flex justify-between">
        <Link className="text-2xl" href="/">c.dev</Link>
        <ListIcon />
      </nav>
    </header>
  )
}
