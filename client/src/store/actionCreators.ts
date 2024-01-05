import { DispatchType, ErrorAction, IError } from '../types';
import * as actionTypes from './actionTypes';

export const simulateHttpRequest = (action: ErrorAction) => {
  return (dispatch: DispatchType) => {
    setTimeout(() => {
      dispatch(action)
    }, 500)
  }
}
export const throwError = (error: IError) => {
  const action: ErrorAction = {
    type: actionTypes.SET_THROW_ERROR,
    throwError: error.throwError,
    errorMessage: error.errorMessage
  }

  return action;
}
