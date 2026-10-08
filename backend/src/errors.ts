/**
 * API error envelope — contract from docs/API_DOCUMENTATION.md:
 * { success: false, error: "CODE", message: "...", details?: {...} }
 */
export class ApiError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly details?: Record<string, string>

  constructor(statusCode: number, code: string, message: string, details?: Record<string, string>) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }

  static badRequest(message = 'Datos de entrada inválidos', details?: Record<string, string>) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details)
  }

  static unauthorized(message = 'Token de autenticación inválido o expirado') {
    return new ApiError(401, 'UNAUTHORIZED', message)
  }

  static forbidden(message = 'No tienes permisos para acceder a este recurso') {
    return new ApiError(403, 'FORBIDDEN', message)
  }

  static notFound(message = 'El recurso solicitado no existe') {
    return new ApiError(404, 'NOT_FOUND', message)
  }

  static conflict(message = 'Conflicto con el estado actual') {
    return new ApiError(409, 'CONFLICT', message)
  }

  static internal(message = 'Error interno del servidor') {
    return new ApiError(500, 'INTERNAL_ERROR', message)
  }
}
