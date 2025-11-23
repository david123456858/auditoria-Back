import { IFailureProcess, ISuccessProcess } from '../interfaces/IResult'

export const FailureProccess = <T>(
  error: T,
  status: number
): IFailureProcess<T> => ({
    error,
    status,
    success: false
  })

export const SuccessProcess = <T>(
  value: T,
  status: number
): ISuccessProcess<T> => ({
    value,
    status,
    success: true
  })
