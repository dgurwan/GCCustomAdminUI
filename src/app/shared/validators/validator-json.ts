import { ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidJson: ValidatorFn = (control) => {

  const value = control.value;

  if (!value) {
    return null;
  }

  try {
    JSON.parse(value);
  } catch (e) {
    //Error
    //JSON is not okay
    jsonValid = false
  }
  return !jsonValid ? {
    'validJson': {
      reason: e,
      value: control.value
    }: null;
  }
 }

/* Is valid. */
return null;

};
