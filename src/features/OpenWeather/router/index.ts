import { Router } from 'express'
import { router } from '../../../config/base'
import { serviceOpenWeatherApi } from '../service'
import { controllerOpenWeatherApi } from '../controller'

export const routeOpenWeatherApi = (): Router => {
  const service = new serviceOpenWeatherApi()
  const controller = new controllerOpenWeatherApi(service)

  router.get('/openWeather/:country', controller.getWeather)
  return router
}
