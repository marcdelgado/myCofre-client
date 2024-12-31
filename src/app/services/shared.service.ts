import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ApiErrorResponse} from "../models/api/api-error-response";

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError
  ): Promise<void> {
    const toastMsg = document.getElementById(element);
    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = 'show requestOk';
        toastMsg.textContent = 'Form submitted successfully.';
        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      } else {
        toastMsg.className = 'show requestKo';
        if (error?.messageDetail) {
          toastMsg.textContent =
            'Error on form submitted, show logs. Message: ' +
            error?.message +
            '. Message detail: ' +
            error?.messageDetail +
            '. Status code: ' +
            error?.statusCode;
        } else {
          toastMsg.textContent =
            'Error on form submitted, show logs. Message: ' +
            error?.message +
            '. Status code: ' +
            error?.statusCode;
        }

        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      }
    }
  }

  responseErrorLog(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }

  errorLog(error: any): void {
    console.error(error);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}


export function debugLog(message: any) {
  if (!environment.production) {
    console.debug(message);
  }
}

export function extractGenericError(error: any): Error {
  let message = 'Unknown error';
  if (error instanceof ApiErrorResponse) {
    message = error.message || 'An unexpected error occurred in the API';
  }
  else if (error instanceof HttpErrorResponse) {
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      message = error.error.message || 'An unexpected error occurred in the API';
    } else if (error.status === 0) {
      message = 'No network connection.';
    } else {
      message = `HTTP Error ${error.status}: ${error.statusText}`;
    }
  }
  else if (error instanceof Error) {
    message = error.message || 'An unexpected error occurred in the application';
  }
  else {
    message = String(error) || 'An unknown error occurred';
  }
  return new Error(message);
}
