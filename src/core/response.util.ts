export interface IResponse {
  error?: IError;
  data?: any;
  affect?: IResAffected;
}

export interface IResAffected {
  success: boolean;
  id?: number;
}

export interface IError {
  code: number;
  message: string;
  timestamp: string;
}

export function responseByData(data: any): IResponse {
  return { data };
}

export function responseByAffect(affect: IResAffected): IResponse {
  return { affect };
}
