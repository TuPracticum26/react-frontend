// routes/documents.jsx
import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/documents')({
  component: () => (
    <>
      <Outlet /> {/* Това позволява на под-маршрутите (index) да се рендерират */}
    </>
  ),
})