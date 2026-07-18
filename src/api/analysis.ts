import { apiGet, apiPostJson, apiUploadFile } from './client';
import { getInstallationId } from '../db/installationId';
import { AnalysisJobResponse, FitnessAnalysisRequest, FitnessAnalysisResponse, PostureAnalysisResponse } from './types';

export function requestFitnessAnalysis(request: FitnessAnalysisRequest): Promise<FitnessAnalysisResponse> {
  return apiPostJson('/api/fitness-analyses', request, { 'X-Installation-Id': getInstallationId() });
}

export function requestPostureAnalysis(exerciseType: string, videoUri: string): Promise<PostureAnalysisResponse> {
  return apiUploadFile('/api/posture-analyses', videoUri, 'video', 'video/mp4', { exerciseType }, {
    'X-Installation-Id': getInstallationId(),
  });
}

export function getAnalysisJob(publicId: string): Promise<AnalysisJobResponse> {
  return apiGet(`/api/analysis-jobs/${publicId}`, undefined, { 'X-Installation-Id': getInstallationId() });
}
