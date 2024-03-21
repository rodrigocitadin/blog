import Link from "next/link";
import ListIcon from "./icons/ListIcon";
import TorusKnot from "./components/TorusKnot";
import Image from 'next/image';

export default function Home() {
  return (
    <main className="text-black-900">
      <div className="z-50 fixed w-full top-0">
        <nav className="mt-2 w-[90%] m-auto flex justify-between">
          <Link href="/">c.dev</Link>
          <ListIcon />
        </nav>
      </div>

      {/* mobius strip here */}
      <TorusKnot />

      {/* my pic and texts here */}
      <div className="mt-32 w-[90%] m-auto">
        <Image
          className="rounded-md m-auto opacity-90 shadow-md shadow-black-600"
          src="/avatar.jpg"
          alt="random guy"
          width={300}
          height={366}
        />
        <p className="mt-4 text-lg">
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
        </p>
      </div>
    </main>
  );
}
