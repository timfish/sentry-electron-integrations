import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { Integration, User } from '@sentry/types';
import * as shortid from 'shortid';

function generateId(): string {
  return shortid.generate().replace(/[-_]/g, '');
}

export function renewUserId(): void {
  getCurrentHub().configureScope(async scope => {
    scope.setUser({ id: generateId() });
  });
}

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
        event.user = { ...event.user, id: generateId() };
        // And set the user.id on the scope
        getCurrentHub().configureScope(scope => {
          scope.setUser(event.user as User);
        });
      }

      return event;
    });
  }
}
