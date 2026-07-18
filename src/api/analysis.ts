import { File } from 'expo-file-system';

import { apiGet, apiPostJson, apiPostMultipart } from './client';
import { getInstallationId } from '../db/installationId';
import { AnalysisJobResponse, FitnessAnalysisRequest, FitnessAnalysisResponse, PostureAnalysisResponse } from './types';

export function requestFitnessAnalysis(request: FitnessAnalysisRequest): Promise<FitnessAnalysisResponse> {
  return apiPostJson('/api/fitness-analyses', request, { 'X-Installation-Id': getInstallationId() });
}

export async function requestPostureAnalysis(exerciseType: string, videoUri: string): Promise<PostureAnalysisResponse> {
  // expo-file-system's File already implements Blob — RN's own Blob polyfill throws
  // "Creating blobs from 'ArrayBuffer' and 'ArrayBufferView' are not supported" if you
  // try to rebuild one from an arrayBuffer(), so just hand the File to FormData as-is.
  const file = new File(videoUri);

  const form = new FormData();
  form.append('video', file, file.name || 'posture.mp4');

  return apiPostMultipart(
    '/api/posture-analyses',
    { exerciseType },
    form,
    { 'X-Installation-Id': getInstallationId() }
  );
}

export function getAnalysisJob(publicId: string): Promise<AnalysisJobResponse> {
  return apiGet(`/api/analysis-jobs/${publicId}`, undefined, { 'X-Installation-Id': getInstallationId() });
}
