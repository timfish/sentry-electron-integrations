import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { Integration } from '@sentry/types';
import { Store } from '@sentry/utils/store';
import { app, remote } from 'electron';
import * as shortid from 'shortid';

function generateId(): string {
  return shortid.generate().replace(/[-_]/g, '');
}

/**
 * Generates a new ID
 */
export function renewUserId(): void {
  const store = new Store<string>((app || remote.app).getPath('userData'), 'id', generateId());
  store.set(generateId());
}

/**
 * Adds a unique ID to your events
 */
export class ElectronUserID implements Integration {
  /**
   * Store the ID
   */
  private store: Store<string> | undefined = undefined;

  /**
   * @inheritDoc
   */
  public name: string = ElectronUserID.id;

  /**
   * @inheritDoc
   */
  public static id: string = 'ElectronUserID';

  /**
   * @inheritDoc
   */
  public setupOnce(): void {
    if (process.type !== 'browser') {
      return;
    }

    addGlobalEventProcessor(async event => {
      if (this.store === undefined) {
        this.store = new Store<string>(app.getPath('userData'), 'id', generateId());
      }

      const self = getCurrentHub().getIntegration(ElectronUserID);
      if (self && (!event.user || !event.user.id)) {
        // Set the user.id on this event
        event.user = { ...event.user, id: this.store.get() };
      }

      return event;
    });
  }
}
