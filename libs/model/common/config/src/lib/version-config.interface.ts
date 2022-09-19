import { IConfig } from './config.interface';

export const VERSION_CONFIG_DOC_ID = 'versioning';

export interface VersionConfig extends IConfig
{
  current: string;

}
