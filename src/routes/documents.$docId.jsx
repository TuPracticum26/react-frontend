import { createFileRoute } from '@tanstack/react-router'
import DocumentView from '../Documents/DocumentView'

export const Route = createFileRoute('/documents/$docId')({
  component: DocumentView,
})