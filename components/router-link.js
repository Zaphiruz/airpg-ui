import { useRouter } from 'next/router'

function RouterLink({ children, href, style, className }) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style} className={className}>
      {children}
    </a>
  )
}

export default RouterLink