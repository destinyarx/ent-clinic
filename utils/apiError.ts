export function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== 'object' || error === null) {
    return fallback
  }

  const candidate = error as {
    data?: { statusMessage?: string; message?: string }
    statusMessage?: string
    message?: string
  }

  return candidate.data?.statusMessage
    ?? candidate.data?.message
    ?? candidate.statusMessage
    ?? candidate.message
    ?? fallback
}
