import { Router } from 'express'
import { router } from '../../../config/base'
import { ServiceApiMaliciosa } from '../service'
import { controllerApiMaliciosa } from '../controller'

/**
 * Router para endpoints maliciosos de auditoría
 * Base path: /api/maliciosa
 *
 * ⚠️ ADVERTENCIA: Estos endpoints simulan ataques maliciosos
 * Solo usar en entornos de desarrollo y testing
 * NO exponer en producción
 *
 * TODOS los endpoints aceptan :country como parámetro dinámico
 * Ejemplo: /api/maliciosa/xss/Madrid
 */
export const routeApiMaliciosa = (): Router => {
  const service = new ServiceApiMaliciosa()
  const controller = new controllerApiMaliciosa(service)

  /**
   * XSS Attack Simulation
   * GET /api/maliciosa/xss/:country
   * Retorna payload con scripts maliciosos inyectados en el país especificado
   * Ejemplo: /api/maliciosa/xss/Barcelona
   */
  router.get('/maliciosa/xss/:country', controller.getXSSPayload)

  /**
   * Broken JSON Simulation
   * GET /api/maliciosa/broken-json/:country
   * Retorna JSON mal formado o corrupto con el país especificado
   * Ejemplo: /api/maliciosa/broken-json/Valencia
   */
  router.get('/maliciosa/broken-json/:country', controller.getBrokenJSON)

  /**
   * Slow Response Simulation
   * GET /api/maliciosa/slow/:country?delay=5
   * Retorna respuesta con delay configurable para el país especificado
   * Query params:
   *   - delay: número de segundos (default: 5, max: 30)
   * Ejemplo: /api/maliciosa/slow/Sevilla?delay=10
   */
  router.get('/maliciosa/slow/:country', controller.getSlowResponse)

  /**
   * HTTP Error Simulation
   * GET /api/maliciosa/error/:country?code=500
   * Retorna diferentes códigos de error HTTP para el país especificado
   * Query params:
   *   - code: código HTTP (400, 401, 403, 404, 429, 500, 502, 503, 504)
   * Ejemplo: /api/maliciosa/error/Bilbao?code=404
   */
  router.get('/maliciosa/error/:country', controller.getErrorResponse)

  /**
   * Data Overflow Simulation
   * GET /api/maliciosa/overflow/:country
   * Retorna cantidades masivas de datos (10MB+) para el país especificado
   * Ejemplo: /api/maliciosa/overflow/Zaragoza
   */
  router.get('/maliciosa/overflow/:country', controller.getOverflowData)

  /**
   * API Contract Change Simulation
   * GET /api/maliciosa/contract-change/:country
   * Retorna estructura diferente a la esperada para el país especificado
   * Ejemplo: /api/maliciosa/contract-change/Málaga
   */
  router.get('/maliciosa/contract-change/:country', controller.getContractChange)

  /**
   * Random Corruption Simulation
   * GET /api/maliciosa/random/:country
   * Retorna corrupción aleatoria de diferentes tipos para el país especificado
   * Ejemplo: /api/maliciosa/random/Murcia
   */
  router.get('/maliciosa/random/:country', controller.getRandomCorruption)

  /**
   * Type Confusion Simulation
   * GET /api/maliciosa/type-confusion/:country
   * Retorna tipos de datos incorrectos para el país especificado
   * Ejemplo: /api/maliciosa/type-confusion/Alicante
   */
  router.get('/maliciosa/type-confusion/:country', controller.getTypeConfusion)

  /**
   * Encoding Issues Simulation
   * GET /api/maliciosa/encoding/:country
   * Retorna problemas de encoding y caracteres especiales
   * Ejemplo: /api/maliciosa/encoding/Córdoba
   */
  router.get('/maliciosa/encoding/:country', controller.getEncodingIssues)

  /**
   * Rate Limit Simulation
   * GET /api/maliciosa/rate-limit/:country
   * Retorna error 429 (Too Many Requests) para el país especificado
   * Ejemplo: /api/maliciosa/rate-limit/Granada
   */
  router.get('/maliciosa/rate-limit/:country', controller.getRateLimitError)

  return router
}
