import { apiPostJson } from '../../../shared/api/client';
import { FitnessAnalysisRequest, FitnessAnalysisResponse } from '../../../shared/api/types';
import { getInstallationId } from '../../../shared/lib/installationId';

export function requestFitnessAnalysis(request: FitnessAnalysisRequest): Promise<FitnessAnalysisResponse> {
  return apiPostJson('/api/fitness-analyses', request, { 'X-Installation-Id': getInstallationId() });
}
