'use client'

import { Fade } from "react-awesome-reveal";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <div className="mt-12 flex flex-col gap-4">
      <Fade triggerOnce>
        <h2 className="mb-4 text-2xl font-bold">
          Projects
        </h2>
        <ProjectCard
          imageSrc="https://github-readme-stats.vercel.app/api/pin/?username=rodrigocitadin&repo=moneyc&theme=graywhite"
          desc="moneyc pin"
        />
        <ProjectCard
          imageSrc="https://github-readme-stats.vercel.app/api/pin/?username=rodrigocitadin&repo=pomotimer&theme=graywhite"
          desc="moneyc pin"
        />
        <ProjectCard
          imageSrc="https://github-readme-stats.vercel.app/api/pin/?username=rodrigocitadin&repo=grokking-algorithms&theme=graywhite"
          desc="moneyc pin"
        />
      </Fade>
    </div>
  )
}
