import { DispatchType, ErrorAction, IError } from '../types';
import * as actionTypes from './actionTypes';

export const simulateHttpRequest = (action: ErrorAction) => {
  return (distpatch: DispatchType) => {
    setTimeout(() => {
      distpatch(action)
    }, 500)
  }
}
export const throwError = (error: IError) => {
  const action: ErrorAction = {
    type: actionTypes.SET_THROW_ERROR,
    throwError: error.throwError,
    errorMessage: error.errorMessage
  }

  return simulateHttpRequest(action);
}
