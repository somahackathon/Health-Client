import { apiUploadFile } from '../../../shared/api/client';
import { PostureAnalysisResponse } from '../../../shared/api/types';
import { getInstallationId } from '../../../shared/lib/installationId';

export function requestPostureAnalysis(exerciseType: string, videoUri: string): Promise<PostureAnalysisResponse> {
  return apiUploadFile('/api/posture-analyses', videoUri, 'video', 'video/mp4', { exerciseType }, {
    'X-Installation-Id': getInstallationId(),
  });
}
