import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { Integration } from '@sentry/types';
import { app, remote } from 'electron';
import * as shortid from 'shortid';
import { Store } from './store';

function generateId(): string {
  return shortid.generate().replace(/[-_]/g, '');
}

let cachedStore: Store<string>;

function getStore(): Store<string> {
  return cachedStore || (cachedStore = new Store<string>((app || remote.app).getPath('userData'), 'id', generateId()));
}

/**
 * Generates a new ID
 */
export function renewUserId(): void {
  const store = getStore();
  store.set(generateId());
}

/**
 * Adds a unique ID to your events
 */
export class ElectronUserID implements Integration {
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
      const self = getCurrentHub().getIntegration(ElectronUserID);
      if (self && (!event.user || !event.user.id)) {
        // Set the user.id on this event
        event.user = { ...event.user, id: getStore().get() };
      }

      return event;
    });
  }
}
