import { createFileRoute } from '@tanstack/react-router';
import CreateDocument from '../Documents/CreateDocument';

export const Route = createFileRoute('/createDocument')({
  component: CreateDocument,
});