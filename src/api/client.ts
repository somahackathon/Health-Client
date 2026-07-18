import { File, UploadType } from 'expo-file-system';

import { API_BASE_URL } from '../config/env';
import { ApiEnvelope } from './types';

export class ApiError extends Error {
  code: string;
  details?: { field: string; reason: string }[];

  constructor(code: string, message: string, details?: { field: string; reason: string }[]) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

function unwrapText<T>(bodyText: string, status: number): T {
  let body: ApiEnvelope<T>;
  try {
    body = JSON.parse(bodyText);
  } catch {
    throw new ApiError('INVALID_RESPONSE', '서버 응답을 처리하지 못했어요. 잠시 후 다시 시도해 주세요');
  }
  if (!body.success || !body.data) {
    throw new ApiError(body.error?.code ?? 'UNKNOWN', body.error?.message ?? `Request failed (${status})`, body.error?.details);
  }
  return body.data;
}

async function unwrap<T>(res: Response): Promise<T> {
  return unwrapText<T>(await res.text(), res.status);
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
  headers?: Record<string, string>
): Promise<T> {
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
        .join('&')
    : '';
  const url = `${API_BASE_URL}${path}${query ? `?${query}` : ''}`;
  const res = await fetch(url, headers ? { headers } : undefined);
  return unwrap<T>(res);
}

export async function apiPostJson<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return unwrap<T>(res);
}

// Uses expo-file-system's native upload task instead of building FormData in JS —
// streaming a large video through global fetch/expo-fetch's multipart body triggered
// an OkHttp "stream was reset" failure; the native uploader avoids that entirely.
export async function apiUploadFile<T>(
  path: string,
  fileUri: string,
  fieldName: string,
  mimeType: string,
  query?: Record<string, string>,
  headers?: Record<string, string>
): Promise<T> {
  const qs = query
    ? Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : '';
  const file = new File(fileUri);
  const result = await file.upload(`${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`, {
    uploadType: UploadType.MULTIPART,
    fieldName,
    mimeType,
    headers,
  });
  return unwrapText<T>(result.body, result.status);
}
