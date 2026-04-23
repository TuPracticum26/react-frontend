import { createLazyFileRoute } from '@tanstack/react-router'
import EditDocument from '../../../Documents/EditDocuments/EditDocument.jsx';

export const Route = createLazyFileRoute('/documents/$docId/edit')({
  component: EditDocument,
})
