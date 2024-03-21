import Link from "next/link";
import ListIcon from "./icons/ListIcon";

export default function Home() {
  return (
    <main className="w-[90%] m-auto">
      <nav className="flex justify-between">
        <Link href="/">c.dev</Link>
        <ListIcon/>
      </nav>
      {/* mobius strip here */}

      {/* my pic and texts here */}


    </main>
  );
}
