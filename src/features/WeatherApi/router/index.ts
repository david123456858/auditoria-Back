import { Router } from 'express'
import { router } from '../../../config/base'
import { serviceWeatherApi } from '../service'
import { controllerWeatherApi } from '../controller'

export const routeWeatherApi = (): Router => {
  const service = new serviceWeatherApi()
  const controller = new controllerWeatherApi(service)

  router.get('/weather/:country', controller.getWeather)
  return router
}
