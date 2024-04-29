export default function ProjectCard({ imageSrc, desc }: { imageSrc: string, desc: string }) {
  return (
    <img
      className="max-w-[450px] w-full"
      src={imageSrc}
      alt={desc}
    />
  )
}
