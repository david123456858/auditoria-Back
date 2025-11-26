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
