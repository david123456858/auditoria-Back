/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FailureProccess, SuccessProcess } from './../../../helpers/result'
import { crudWeather } from '../../../interfaces/CrudWeather'
import { IFailureProcess, ISuccessProcess } from '../../../interfaces/IResult'

import axios from 'axios'

export class serviceOpenWeatherApi implements crudWeather {
  async getWeather (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any> > {
    try {
      const reponseWeather = await axios.get(`${process.env.OPENWEATHER_BASE_URL}/weather?q=${country}&appid=${process.env.OPENWATHER_KEY}`)

      return SuccessProcess(reponseWeather.data, reponseWeather.status)
    } catch (error) {
      console.log(error)
      return FailureProccess('Algo paso mi hermano', 500)
    }
  }
}
