'use client'

import Sla from './markdowns/sla.md'

export default function Blog() {
  return (
    <div className="w-[90%] md:w-[80%] xl:w-[50%] m-auto">
      <h1 className="text-2xl underline mt-40">TODO blog</h1>
      <Sla />
    </div>
  )
}
