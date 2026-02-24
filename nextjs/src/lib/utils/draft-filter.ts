import { NextRequest } from 'next/server';
import { verifyAuth } from './auth';

// returns a simple status string that matches the service layer types.
// undefined means "no status filter" (usually for admins requesting all).
export function getStatusFilter(req: NextRequest): "draft" | "published" | undefined {
  const { searchParams } = new URL(req.url);
  const requestedStatus = searchParams.get('status');
  const isAuthenticated = verifyAuth(req);

  // If authenticated and explicitly requesting drafts, return draft
  if (isAuthenticated && requestedStatus === 'draft') {
    return 'draft';
  }

  // Authenticated but no status param => admin wants everything
  if (isAuthenticated && !requestedStatus) {
    return undefined; // no filter
  }

  // Public users only see published content
  return 'published';
}
