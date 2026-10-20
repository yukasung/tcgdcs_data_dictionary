import { useMDXComponents } from 'nextra-theme-docs'
import DocPage from './DocPage'
const Wrapper = useMDXComponents().wrapper
export default function ReferencePage(props) {
  return <Wrapper toc={[]} metadata={{title:props.title}}><DocPage {...props}/></Wrapper>
}