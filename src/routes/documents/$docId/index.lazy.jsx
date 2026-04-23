import { createLazyFileRoute } from '@tanstack/react-router'
import DocumentView from '../../../Documents/DocumentView/DocumentView';

export const Route = createLazyFileRoute('/documents/$docId/')({
  component: DocumentView,
})