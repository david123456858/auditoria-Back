/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NextFunction, Request, Response } from 'express'
import { ServiceApiMaliciosa } from '../service/index'

/**
 * Controller para endpoints maliciosos de auditoría
 * Cada método documenta el tipo de ataque simulado
 */
export class controllerApiMaliciosa {
  constructor (private readonly service: ServiceApiMaliciosa) {
    // Binding de métodos
    this.getXSSPayload = this.getXSSPayload.bind(this)
    this.getBrokenJSON = this.getBrokenJSON.bind(this)
    this.getSlowResponse = this.getSlowResponse.bind(this)
    this.getErrorResponse = this.getErrorResponse.bind(this)
    this.getOverflowData = this.getOverflowData.bind(this)
    this.getContractChange = this.getContractChange.bind(this)
    this.getRandomCorruption = this.getRandomCorruption.bind(this)
    this.getTypeConfusion = this.getTypeConfusion.bind(this)
    this.getEncodingIssues = this.getEncodingIssues.bind(this)
    this.getRateLimitError = this.getRateLimitError.bind(this)
  }

  /**
   * XSS ATTACK ENDPOINT
   * GET /api/maliciosa/xss/:country
   *
   * Ataque: Inyección de código JavaScript malicioso
   * Objetivo: Verificar sanitización de datos en el frontend
   *
   * El frontend debe:
   * - Escapar HTML antes de renderizar
   * - Usar textContent en vez de innerHTML
   * - Sanitizar con DOMPurify o similar
   * - Validar datos antes de mostrarlos
   */
  async getXSSPayload (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getXSSPayload(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ XSS Attack Simulation for "${country}" - Sanitize before rendering!`
    })
  }

  /**
   * BROKEN JSON ENDPOINT
   * GET /api/maliciosa/broken-json/:country
   *
   * Ataque: JSON mal formado o corrupto
   * Objetivo: Probar manejo de errores de parsing
   *
   * El frontend debe:
   * - Usar try-catch en JSON.parse()
   * - Mostrar error amigable al usuario
   * - No crashear la aplicación
   * - Loggear el error para debugging
   */
  async getBrokenJSON (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getBrokenJSON(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    // Enviamos el JSON corrupto como texto para que llegue al frontend
    res.status(result.status)
      .set('Content-Type', 'application/json')
      .send(result.value)
  }

  /**
   * SLOW RESPONSE ENDPOINT
   * GET /api/maliciosa/slow/:country?delay=5
   *
   * Ataque: Latencia extrema (3-10 segundos)
   * Objetivo: Probar timeouts y loading states
   *
   * El frontend debe:
   * - Mostrar loading spinner
   * - Implementar timeout de request
   * - Permitir cancelar la petición
   * - Mantener UI responsive
   */
  async getSlowResponse (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const delay = parseInt(req.query.delay as string) || 5
    const maxDelay = Math.min(delay, 30) // Límite de 30 segundos

    const result = await this.service.getSlowResponse(country, maxDelay)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      info: `⏱️ Response for "${country}" delayed by ${maxDelay} seconds`
    })
  }

  /**
   * ERROR RESPONSE ENDPOINT
   * GET /api/maliciosa/error/:country?code=500
   *
   * Ataque: Códigos HTTP de error variados
   * Objetivo: Probar manejo de errores HTTP
   *
   * El frontend debe:
   * - Detectar el código de error
   * - Mostrar mensaje apropiado según el código
   * - Intentar retry en errores 5xx
   * - No retryar en errores 4xx
   */
  async getErrorResponse (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const errorCode = parseInt(req.query.code as string) || undefined
    const result = await this.service.getErrorResponse(country, errorCode)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ Rate limit for "${country}" - Read Retry-After and back off!`
    })
  }

  /**
   * DATA OVERFLOW ENDPOINT
   * GET /api/maliciosa/overflow/:country
   *
   * Ataque: Cantidades masivas de datos (10MB+)
   * Objetivo: Probar límites de memoria y performance
   *
   * El frontend debe:
   * - Implementar paginación
   * - Virtualización de listas largas
   * - Limitar datos mostrados
   * - Monitorear uso de memoria
   * - Mostrar warning si el payload es muy grande
   */
  async getOverflowData (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getOverflowData(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ Large payload for "${country}" - May cause memory issues!`
    })
  }

  /**
   * CONTRACT CHANGE ENDPOINT
   * GET /api/maliciosa/contract-change/:country
   *
   * Ataque: Estructura de datos diferente a la esperada
   * Objetivo: Probar robustez ante cambios de API
   *
   * El frontend debe:
   * - Validar estructura de respuesta
   * - Usar valores por defecto para campos faltantes
   * - No crashear con campos extra
   * - Manejar tipos de datos inesperados
   * - Loggear discrepancias
   */
  async getContractChange (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getContractChange(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ API contract changed for "${country}" - Structure differs from expected!`
    })
  }

  /**
   * RANDOM CORRUPTION ENDPOINT
   * GET /api/maliciosa/random/:country
   *
   * Ataque: Combinación aleatoria de ataques
   * Objetivo: Testing realista de robustez general
   *
   * El frontend debe:
   * - Manejar cualquier tipo de corrupción
   * - No asumir formato específico
   * - Validar todos los datos
   * - Recuperarse gracefully de errores
   */
  async getRandomCorruption (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getRandomCorruption(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ Random corruption for "${country}" - Expect the unexpected!`
    })
  }

  /**
   * TYPE CONFUSION ENDPOINT
   * GET /api/maliciosa/type-confusion/:country
   *
   * Ataque: Tipos de datos incorrectos
   * Objetivo: Probar validación de tipos
   *
   * El frontend debe:
   * - Validar tipos antes de usar
   * - Convertir tipos cuando sea necesario
   * - No asumir tipos implícitamente
   * - Usar TypeScript guards
   */
  async getTypeConfusion (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getTypeConfusion(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ Type confusion for "${country}" - Validate types before using!`
    })
  }

  /**
   * ENCODING ISSUES ENDPOINT
   * GET /api/maliciosa/encoding/:country
   *
   * Ataque: Problemas de encoding y caracteres especiales
   * Objetivo: Probar manejo de diferentes encodings
   *
   * El frontend debe:
   * - Manejar UTF-8 correctamente
   * - Escapar caracteres especiales
   * - Decodificar HTML entities si es necesario
   * - Mostrar emojis correctamente
   */
  async getEncodingIssues (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getEncodingIssues(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ Encoding issues for "${country}" - Handle special characters carefully!`
    })
  }

  /**
   * RATE LIMIT ENDPOINT
   * GET /api/maliciosa/rate-limit/:country
   *
   * Ataque: Error 429 (Too Many Requests)
   * Objetivo: Probar manejo de rate limiting
   *
   * El frontend debe:
   * - Detectar error 429
   * - Leer Retry-After header
   * - Implementar backoff exponencial
   * - Informar al usuario del límite
   */
  async getRateLimitError (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country || 'Madrid'
    const result = await this.service.getRateLimitError(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }
      return next(error)
    }

    res.status(result.status).json({
      message: result.value,
      warning: `⚠️ Rate limit for "${country}" - Read Retry-After and back off!`
    })
  }
}
