import { ReactNode } from "react";

// Error context types

interface IErrMessage {
  status: number | null;
  message: string | null;
}

export interface IError {
	throwError: boolean;
	errorMessage: IErrMessage;
}

export type ErrorContextType = {
  error: IError;
  saveError: (error: IError) => void;

}

export interface IErrorCtxProps {
  children: ReactNode;
}
