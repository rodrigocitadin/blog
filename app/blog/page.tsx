import markdownIt from "markdown-it"

export default function Blog() {
  const md = markdownIt()
  const result = md.parse('# Sla', {})

  return (
    <div>
      <h1 className="text-2xl underline mt-40">TODO blog</h1>
      <pre>
        {result.map((v) => {
          return <h1>{v.content}</h1>
        })}
      </pre>
    </div>
  )
}
