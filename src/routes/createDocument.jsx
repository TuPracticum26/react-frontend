import { createFileRoute } from '@tanstack/react-router';
import CreateDocument from '../Documents/CreateDocuments/CreateDocument';

export const Route = createFileRoute('/createDocument')({
  component: CreateDocument,
});