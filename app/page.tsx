import Link from "next/link";
import ListIcon from "./icons/ListIcon";
import TorusKnot from "./components/TorusKnot";
import Resume from "./components/Resume";

export default function Home() {
  return (
    <main className="text-black-900">
      <div className="z-50 fixed w-full top-0">
        <nav className="mt-2 w-[90%] md:w-[80%] xl:w-[50%] m-auto flex justify-between">
          <Link href="/">c.dev</Link>
          <ListIcon />
        </nav>
      </div>

      {/* mobius strip here */}
      <TorusKnot />

      {/* my pic and texts here */}
      <Resume />
    </main>
  );
}
