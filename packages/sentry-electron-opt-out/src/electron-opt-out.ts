import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { Integration } from '@sentry/types';
import { isEnabled } from './state';

/** Electron integration that cleans up the event. */
export class ElectronOptOut implements Integration {
  /**
   * @inheritDoc
   */
  public name: string = ElectronOptOut.id;

  /**
   * @inheritDoc
   */
  public static id: string = 'ElectronOptOut';

  /**
   * @inheritDoc
   */
  public setupOnce(): void {
    if (process.type !== 'browser') {
      return;
    }

    addGlobalEventProcessor(
      // if the plugin is enabled and reporting is disabled, return null to
      // stop sending of the event
      async event => (getCurrentHub().getIntegration(ElectronOptOut) && !(await isEnabled()) ? null : event),
    );
  }
}
