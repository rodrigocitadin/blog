export default function ProjectCard({ imageSrc, desc }: { imageSrc: string, desc: string }) {
  return (
    <img
      className="max-w-[450px]"
      src={imageSrc}
      alt={desc}
    />
  )
}
