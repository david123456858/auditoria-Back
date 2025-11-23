import { NextFunction, Request, Response } from 'express'
import { serviceWeatherApi } from '../service'

export class controllerWeatherApi {
  constructor (private readonly service: serviceWeatherApi) {
    this.getWeather = this.getWeather.bind(this)
  }

  async getWeather (req: Request, res: Response, next: NextFunction): Promise<void> {
    const country = req.params.country
    const result = await this.service.getWeather(country)

    if (!result.success) {
      const error = {
        error: result.error,
        status: result.status,
        success: result.success
      }

      return next(error)
    }

    res.status(result.status).json({ message: result.value })
  }
}
