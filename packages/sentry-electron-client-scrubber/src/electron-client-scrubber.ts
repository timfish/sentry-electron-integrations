import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { Integration, SentryEvent } from '@sentry/types';

interface KeyObj {
  [key: string]: string | KeyObj;
}

/** Electron integration that regexes all strings on the event object. */
export class ElectronClientScrubber implements Integration {
  /**
   * @inheritDoc
   */
  public name: string = ElectronClientScrubber.id;

  /**
   * @inheritDoc
   */
  public static id: string = 'ElectronDataScrubber';

  private replacements: Array<[RegExp, string]>;

  public constructor(...replacements: Array<[RegExp, string]>) {
    this.replacements = replacements;
  }

  /**
   * @inheritDoc
   */
  public setupOnce(): void {
    if (process.type !== 'browser') {
      return;
    }

    addGlobalEventProcessor(async event =>
      getCurrentHub().getIntegration(ElectronClientScrubber)
        ? this.replacements.reduce((ev, replace) => this.recursiveRegexReplace(ev, replace), event)
        : event,
    );
  }

  private recursiveRegexReplace(event: SentryEvent, replace: [RegExp, string]): SentryEvent {
    if (event) {
      const obj = event as KeyObj;

      for (const key of Object.keys(obj)) {
        const prop = obj[key];
        if (typeof prop === 'string') {
          obj[key] = prop.replace(replace[0], replace[1]);
        } else if (typeof prop === 'object') {
          obj[key] = this.recursiveRegexReplace(prop, replace) as KeyObj;
        }
      }
    }
    return event;
  }
}
