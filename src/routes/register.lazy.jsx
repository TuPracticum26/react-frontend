import { createLazyFileRoute } from '@tanstack/react-router'
import Register from '../Register/Register'

export const Route = createLazyFileRoute('/register')({
  component: Register,
})
