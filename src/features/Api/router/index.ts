import { Router } from 'express'
import { router } from '../../../config/base'
import { ServiceApiMaliciosa } from '../service'
import { controllerApiMaliciosa } from '../controller'

export const routeApiMaliciosa = (): Router => {
  const service = new ServiceApiMaliciosa()
  const controller = new controllerApiMaliciosa(service)

  router.get('/maliciosa/xss/:country', controller.getXSSPayload)

  router.get('/maliciosa/broken-json/:country', controller.getBrokenJSON)

  router.get('/maliciosa/slow/:country', controller.getSlowResponse)

  router.get('/maliciosa/error/:country', controller.getErrorResponse)

  router.get('/maliciosa/overflow/:country', controller.getOverflowData)

  router.get('/maliciosa/contract-change/:country', controller.getContractChange)

  router.get('/maliciosa/random/:country', controller.getRandomCorruption)

  router.get('/maliciosa/type-confusion/:country', controller.getTypeConfusion)

  router.get('/maliciosa/encoding/:country', controller.getEncodingIssues)

  router.get('/maliciosa/rate-limit/:country', controller.getRateLimitError)

  return router
}
