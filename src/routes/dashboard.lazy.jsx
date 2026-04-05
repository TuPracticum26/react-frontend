import { createLazyFileRoute } from '@tanstack/react-router'
import Dashboard from '../Dashboard/Dashboard'

export const Route = createLazyFileRoute('/dashboard')({
  component: Dashboard,
})
