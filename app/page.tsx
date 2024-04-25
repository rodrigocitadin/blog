import TorusKnot from "./components/TorusKnot";
import Resume from "./components/Resume";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <main className="w-[90%] md:w-[80%] xl:w-[50%] m-auto text-black-900">
      <TorusKnot />
      <Resume />
      <Projects />
    </main>
  );
}
