'use client'

import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  let [fade, setFade] = useState("");

  const listenScrollEvent = () => {
    window.scrollY >= 1350 && setFade("opacity-100")
    console.log(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent)
  })

  return (
    <div className={`mt-12 opacity-0 duration-1000 transition-opacity ${fade}`}>
      <h2 className="mb-8 text-2xl font-bold">
        Projects
      </h2>
      <div className="flex flex-col gap-4">
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
      </div>
    </div>
  )
}
