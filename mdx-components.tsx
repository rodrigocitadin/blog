import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-32 font-bold text-4xl text-black-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-bold text-2xl text-black-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-bold text-xl text-black-900">
        {children}
      </h3>
    ),
    li: ({ children }) => (
      <li className="pl-8 before:content-['-_'] text-black-900">
        {children}
      </li>
    ),
    ...components,
  }
}
