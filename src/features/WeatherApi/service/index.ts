/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FailureProccess, SuccessProcess } from './../../../helpers/result'
import { crudWeather } from '../../../interfaces/CrudWeather'
import { IFailureProcess, ISuccessProcess } from '../../../interfaces/IResult'

import axios from 'axios'

export class serviceWeatherApi implements crudWeather {
  async getWeather (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any> > {
    try {
      const reponseWeather = await axios.get(`${process.env.WEATHER_URL}/current.json?key=${process.env.WEATHER_SECRET}&q=${country}&aqi=no`)

      return SuccessProcess(reponseWeather.data, reponseWeather.status)
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        return FailureProccess(
          error.response?.data?.message || 'Error al consultar clima',
          error.response?.status || 500
        )
      }
      return FailureProccess('Algo paso mi hermano', 500)
    }
  }
}
