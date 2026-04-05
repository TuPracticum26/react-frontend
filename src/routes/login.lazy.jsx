import { createLazyFileRoute } from '@tanstack/react-router'
import Login from '../Login/Login.jsx'

export const Route = createLazyFileRoute('/login')({
  component: Login,
})
