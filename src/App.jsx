import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import ServiceGateway from './pages/ServiceGateway'
import StudioPage from './pages/StudioPage'
import ExpertisePage from './pages/ExpertisePage'
import ProjectsPage from './pages/ProjectsPage'
import { visibleProjects } from './data/projects'
import { gatewayContent } from './data/gatewayContent'
import { resolveServiceRoute } from './data/servicePaths'
import { expertise } from './data/expertise'

export default function App() {
  const route = resolveServiceRoute(window.location.pathname)
  const serviceContent = route.type === 'service' ? expertise[route.category.id] : null
  const selectedService = serviceContent?.services.find(item => item.id === route.serviceId)
  const selectedProject = visibleProjects.find(item => item.id === route.projectId)

  useEffect(() => {
    if (route.type === 'redirect') window.location.replace(route.to)
  }, [route.type, route.to])

  useEffect(() => {
    document.title = route.type === 'projects'
      ? `${route.projectId ? selectedProject?.title || 'Project unavailable' : 'Projects'} | Ferhan Perth`
      : route.type === 'site'
      ? 'Ferhan Architects | Architecture & Design Studio Perth'
      : route.type === 'service'
        ? `${selectedService ? `${selectedService.title} | ` : ''}${route.category.title} | Ferhan Perth`
      : route.type === 'gateway'
        ? gatewayContent.heading
        : route.type === 'planned'
          ? `${route.category.title} | ${gatewayContent.brandLabel}`
          : `Page not found | ${gatewayContent.brandLabel}`
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.content = route.type === 'projects'
        ? selectedProject?.summary || 'Explore architecture, interiors and developments from Ferhan in Perth, Western Australia.'
        : route.type === 'site'
        ? 'Ferhan Architects is an architecture and design studio based in Perth, Western Australia, specialising in residential, multi-residential and commercial architecture since 2007.'
        : serviceContent ? selectedService?.short || serviceContent.intro : 'Ferhan brings together design, development and consulting expertise in Perth, Western Australia. Choose the service that fits your project.'
    }
  }, [route.type, route.category?.title, selectedService, serviceContent, selectedProject, route.projectId])

  if (route.type === 'redirect') return null

  return (
    <MotionConfig reducedMotion="user">
      {route.type === 'projects' ? <ProjectsPage projectId={route.projectId} /> : route.type === 'site' ? <StudioPage /> : route.type === 'service' ? <ExpertisePage route={route} /> : <ServiceGateway route={route} />}
    </MotionConfig>
  )
}
