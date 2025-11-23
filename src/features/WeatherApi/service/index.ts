import { FailureProccess, SuccessProcess } from './../../../helpers/result'
import { crudWeather } from '../../../interfaces/CrudWeather'
import { IFailureProcess, ISuccessProcess } from '../../../interfaces/IResult'

import axios from 'axios'

export class serviceWeatherApi implements crudWeather {
  async getWeather (): Promise<ISuccessProcess<any> | IFailureProcess<any> > {
    try {
      const reponseWeather = await axios.get('https://api.weatherapi.com/v1/current.json?key=afefacb0913f4e61975163821252605&q=Colombia&aqi=no')
      return SuccessProcess(reponseWeather, 200)
    } catch (error) {
      console.log(error)
      return FailureProccess('Algo paso mi hermano', 500)
    }
  }
}
