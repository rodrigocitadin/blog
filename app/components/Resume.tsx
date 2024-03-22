import Image from 'next/image';

export default function Resume() {
  return (
    <div className="mt-32 w-[90%] md:w-[80%] xl:w-[50%] m-auto">
      <Image
        className="float-start mr-8 mb-4 rounded-md opacity-90 shadow-md shadow-black-600"
        src="/avatar.jpg"
        alt="random guy"
        width={300}
        height={366}
      />
      <p className="text-lg">
        Meet Citadin, a passionate software engineer with a knack for tackling complex challenges. Since diving into coding in 2020, Citadin has swiftly mastered a range of technologies and methodologies. With 1.5 years of hands-on experience in backend development using Typescript and Nest.js, Citadin has honed their skills in building robust and scalable server-side applications.
      </p>
      <p className="text-lg">
        What sets Citadin apart is their full-stack expertise, seamlessly transitioning between front-end and back-end technologies. Whether it's crafting elegant user interfaces with React.js and Next.js or architecting efficient backend systems with Elixir, .NET, C#, and F#, Citadin brings a versatile skill set to the table.
      </p>
      <p className="text-lg">
        Beyond their technical prowess, Citadin has a deep understanding of general math, type systems, distributed systems, and functional languages. This comprehensive knowledge allows Citadin to not only write clean and maintainable code but also design and implement sophisticated solutions that stand the test of time.
      </p>
      <p className="text-lg">
        In the ever-evolving landscape of software engineering, Citadin's blend of experience, expertise, and continuous learning makes them a valuable asset to any team or project.
      </p>
    </div>
  )
}
