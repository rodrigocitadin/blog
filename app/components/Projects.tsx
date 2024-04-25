function ProjectCard({ imageSrc, desc }: { imageSrc: string, desc: string }) {
  return (
    <img
      className="max-w-[450px]"
      src={imageSrc}
      alt={desc}
    />
  )
}

export default function Projects() {
  return (
    <div className="mt-12">
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
