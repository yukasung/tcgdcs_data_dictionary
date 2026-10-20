import { useMDXComponents } from 'nextra-theme-docs'

const { h1: Heading } = useMDXComponents()

export default function DocPage({ children, title, intro }) {
  return (
    <section className="doc-page">
      <Heading>{title}</Heading>
      {intro && <p className="lead">{intro}</p>}
      {children}
    </section>
  )
}
