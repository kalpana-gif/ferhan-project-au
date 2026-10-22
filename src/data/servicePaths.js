export const servicePaths = [
  {
    id: 'architects-builders',
    title: 'Architects',
    path: '/services/architects-builders',
    image: '/assets/slide_02-1600x1068.jpg',
    description: 'Architecture, interiors and construction shaped around the way you live.',
    available: true,
  },
  {
    id: 'developments',
    title: 'Developments',
    path: '/services/developments',
    image: '/assets/gallery-exterior-day.jpg',
    description: 'Considered places, from an early idea through to the built result.',
    available: true,
  },
  {
    id: 'consultants',
    title: 'Consultants',
    path: '/services/consultants',
    image: '/assets/slide_10-810x1080.jpg',
    description: 'Specialist guidance for the decisions that shape a project.',
    available: true,
  },
]

export function resolveServiceRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return { type: 'gateway' }
  if (path === '/services') return { type: 'redirect', to: '/' }
  if (path === '/projects') return { type: 'projects' }
  if (/^\/projects\/[^/]+$/.test(path)) return { type: 'projects', projectId: path.slice('/projects/'.length) }

  const category = servicePaths.find((item) => item.path === path || (item.id !== 'architects-builders' && path.startsWith(`${item.path}/`)))
  if (category) return { type: category.id === 'architects-builders' ? 'site' : 'service', category, serviceId: path.slice(category.path.length + 1) || null }

  return { type: 'not-found' }
}
