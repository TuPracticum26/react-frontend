import { createFileRoute } from '@tanstack/react-router'
import Documents from '../Documents/Documents'

export const Route = createFileRoute('/documents/')({
  component: Documents,
})
