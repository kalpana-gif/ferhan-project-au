import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import ServiceGateway from './pages/ServiceGateway'
import StudioPage from './pages/StudioPage'
import { gatewayContent } from './data/gatewayContent'
import { resolveServiceRoute } from './data/servicePaths'

export default function App() {
  const route = resolveServiceRoute(window.location.pathname)

  useEffect(() => {
    if (route.type === 'redirect') window.location.replace(route.to)
  }, [route.type, route.to])

  useEffect(() => {
    document.title = route.type === 'site'
      ? 'Farhan Architects | Architecture & Design Studio Perth'
      : route.type === 'gateway'
        ? gatewayContent.heading
        : route.type === 'planned'
          ? `${route.category.title} | ${gatewayContent.brandLabel}`
          : `Page not found | ${gatewayContent.brandLabel}`
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.content = route.type === 'site'
        ? 'Farhan Architects is an architecture and design studio based in Perth, Western Australia, specialising in residential, multi-residential and commercial architecture since 2007.'
        : 'Farhan solution brings together design, development and consulting expertise in Perth, Western Australia. Choose the service that fits your project.'
    }
  }, [route.type, route.category?.title])

  if (route.type === 'redirect') return null

  return (
    <MotionConfig reducedMotion="user">
      {route.type === 'site' ? <StudioPage /> : <ServiceGateway route={route} />}
    </MotionConfig>
  )
}
