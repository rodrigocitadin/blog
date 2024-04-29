import TorusKnot from "./components/TorusKnot";
import Resume from "./components/Resume";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <main className="text-black-900">
      <TorusKnot />
      <div className="w-[90%] md:w-[80%] xl:w-[50%] m-auto">
        <Resume />
        <Projects />
      </div>
    </main>
  );
}
