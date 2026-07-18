import { db } from './client';
import { AnalysisStatus, Feedback, Recommendation } from '../api/types';

export type FitnessAnalysisRecord = {
  jobId: string;
  status: AnalysisStatus;
  modelVersion: string | null;
  summary: string | null;
  recommendations: Recommendation[] | null;
  failureMessage: string | null;
  completedAt: string | null;
};

export type PostureAnalysisRecord = {
  jobId: string;
  exerciseType: string;
  status: AnalysisStatus;
  modelVersion: string | null;
  feedback: Feedback[] | null;
  failureMessage: string | null;
  completedAt: string | null;
};

export function saveFitnessAnalysis(record: FitnessAnalysisRecord): void {
  db.runSync(
    `INSERT INTO fitness_analyses (job_id, status, model_version, summary, recommendations, failure_message, created_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (job_id) DO UPDATE SET
       status = excluded.status,
       model_version = excluded.model_version,
       summary = excluded.summary,
       recommendations = excluded.recommendations,
       failure_message = excluded.failure_message,
       completed_at = excluded.completed_at`,
    [
      record.jobId,
      record.status,
      record.modelVersion,
      record.summary,
      record.recommendations ? JSON.stringify(record.recommendations) : null,
      record.failureMessage,
      new Date().toISOString(),
      record.completedAt,
    ]
  );
}

export function getLatestFitnessAnalysis(): FitnessAnalysisRecord | null {
  const row = db.getFirstSync<{
    job_id: string;
    status: AnalysisStatus;
    model_version: string | null;
    summary: string | null;
    recommendations: string | null;
    failure_message: string | null;
    completed_at: string | null;
  }>('SELECT * FROM fitness_analyses ORDER BY created_at DESC LIMIT 1');
  if (!row) return null;
  return {
    jobId: row.job_id,
    status: row.status,
    modelVersion: row.model_version,
    summary: row.summary,
    recommendations: row.recommendations ? JSON.parse(row.recommendations) : null,
    failureMessage: row.failure_message,
    completedAt: row.completed_at,
  };
}

export function savePostureAnalysis(record: PostureAnalysisRecord): void {
  db.runSync(
    `INSERT INTO posture_analyses (job_id, exercise_type, status, model_version, feedback, failure_message, created_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (job_id) DO UPDATE SET
       status = excluded.status,
       model_version = excluded.model_version,
       feedback = excluded.feedback,
       failure_message = excluded.failure_message,
       completed_at = excluded.completed_at`,
    [
      record.jobId,
      record.exerciseType,
      record.status,
      record.modelVersion,
      record.feedback ? JSON.stringify(record.feedback) : null,
      record.failureMessage,
      new Date().toISOString(),
      record.completedAt,
    ]
  );
}

export function getLatestPostureAnalysis(): PostureAnalysisRecord | null {
  const row = db.getFirstSync<{
    job_id: string;
    exercise_type: string;
    status: AnalysisStatus;
    model_version: string | null;
    feedback: string | null;
    failure_message: string | null;
    completed_at: string | null;
  }>('SELECT * FROM posture_analyses ORDER BY created_at DESC LIMIT 1');
  if (!row) return null;
  return {
    jobId: row.job_id,
    exerciseType: row.exercise_type,
    status: row.status,
    modelVersion: row.model_version,
    feedback: row.feedback ? JSON.parse(row.feedback) : null,
    failureMessage: row.failure_message,
    completedAt: row.completed_at,
  };
}
