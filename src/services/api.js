/**
 * API client — the ONLY module allowed to know how to talk to the backend.
 *
 * - Access token lives in memory here (never localStorage: XSS must not be
 *   able to exfiltrate a bearer token).
 * - Refresh travels in an httpOnly cookie (set by the server), sent
 *   automatically via credentials: 'include'.
 * - On 401 it attempts ONE token refresh and replays the request
 *   (single-flight: parallel 401s share the same refresh promise).
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'

let accessToken = null
let refreshPromise = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

async function doFetch(path, { method = 'GET', body, headers } = {}) {
  return fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

async function tryRefresh() {
  refreshPromise ??= (async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) return false
      const json = await response.json()
      accessToken = json.data?.accessToken ?? null
      return Boolean(accessToken)
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

/**
 * Performs an API call. Returns { ok, status, data } — never throws on HTTP
 * errors; network errors return { ok: false, status: 0, data: null }.
 */
export async function api(path, options = {}) {
  let response = await doFetch(path, options).catch(() => null)

  if (response === null) {
    return { ok: false, status: 0, data: null }
  }

  // One transparent refresh + replay on 401 (except for the refresh call
  // itself, which must not recurse).
  if (response.status === 401 && !path.startsWith('/auth/refresh')) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      response = await doFetch(path, options).catch(() => null)
      if (response === null) return { ok: false, status: 0, data: null }
    }
  }

  if (response.status === 204) return { ok: true, status: 204, data: null }

  let data = null
  try {
    data = await response.json()
  } catch {
    /* empty body */
  }

  return { ok: response.ok, status: response.status, data }
}
