import { createLazyFileRoute } from '@tanstack/react-router';
import CreateDocument from '../Documents/CreateDocuments/CreateDocument';

export const Route = createLazyFileRoute('/createDocument')({
  component: CreateDocument,
});