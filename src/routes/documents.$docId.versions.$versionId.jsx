import { createFileRoute } from '@tanstack/react-router'
import DocumentView from '../Documents/DocumentView/DocumentView'

export const Route = createFileRoute('/documents/$docId/versions/$versionId')({
  component: DocumentView,
})