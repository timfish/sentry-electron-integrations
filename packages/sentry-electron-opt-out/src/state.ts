import { app, remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const exists = promisify(fs.exists);
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

const appPath = (app || remote.app).getPath('userData');
const disabledFilePath = path.join(appPath, 'crash-reports.disabled');

export async function isEnabled(): Promise<boolean> {
  return !(await exists(disabledFilePath));
}

export async function setEnabled(enabled: boolean): Promise<void> {
  try {
    if (await exists(disabledFilePath)) {
      if (enabled) {
        await unlink(disabledFilePath);
      }
    } else if (!enabled) {
      await writeFile(disabledFilePath, '');
    }
  } catch (e) {
    // do nothing
  }
}
