import type { FastifyError, FastifyInstance } from 'fastify'
import { ApiError } from '../errors.js'

export async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, _request, reply) => {
    // Known API errors → documented envelope
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      })
    }

    // Fastify validation errors (schema body/querystring/params) → 400 envelope
    if (error.validation) {
      const details: Record<string, string> = {}
      for (const issue of error.validation) {
        const key = issue.instancePath ? issue.instancePath.replace(/^\//, '') : 'body'
        details[key] ??= issue.message ?? 'Valor inválido'
      }
      return reply.status(400).send({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Datos de entrada inválidos',
        details,
      })
    }

    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return reply.status(error.statusCode).send({
        success: false,
        error: 'HTTP_ERROR',
        message: error.message,
      })
    }

    // Unknown → 500, log full detail server-side, leak nothing to the client
    fastify.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    })
  })

  fastify.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      success: false,
      error: 'NOT_FOUND',
      message: 'El recurso solicitado no existe',
    })
  })
}
