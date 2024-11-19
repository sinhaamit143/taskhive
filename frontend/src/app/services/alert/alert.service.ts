import { Injectable } from '@angular/core';
import AWN from 'awesome-notifications';

const globalOptions = {
  position: 'bottom-right' as const, // Use `as const` to match the expected type exactly
  duration: 2000,
};

const notifier = new AWN(globalOptions);

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}

  successToast(msg: string) {
    notifier.success(msg, globalOptions);
  }

  errorToast(msg: string) {
    notifier.alert(msg, globalOptions);
  }

  warningToast(msg: string) {
    notifier.warning(msg, globalOptions);
  }

  infoToast(msg: string) {
    notifier.info(msg, globalOptions);
  }

  tipToast(msg: string) {
    notifier.tip(msg, globalOptions);
  }

  asyncToast(msg: string) {
    notifier.async(Promise.resolve(msg));
  }

  asyncBlock(msg: string) {
    notifier.asyncBlock(Promise.resolve(msg));
  }

  modal(msg: string) {
    notifier.modal(msg);
  }
}
