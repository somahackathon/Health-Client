import { apiGet } from '../../../shared/api/client';
import { AnalysisJobResponse } from '../../../shared/api/types';
import { getInstallationId } from '../../../shared/lib/installationId';

export function getAnalysisJob(publicId: string): Promise<AnalysisJobResponse> {
  return apiGet(`/api/analysis-jobs/${publicId}`, undefined, { 'X-Installation-Id': getInstallationId() });
}
