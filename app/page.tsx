import TorusKnot from "./components/TorusKnot";
import Resume from "./components/Resume";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <main className="text-black-900">
      <TorusKnot />
      <Resume />
      <Projects />
    </main>
  );
}
