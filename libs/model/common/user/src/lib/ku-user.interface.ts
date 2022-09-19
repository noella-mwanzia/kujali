import { User } from '@iote/bricks';

import { KuUserRoles } from './ku-user-roles.interface';
import { KuUserProfile } from './ku-user-profile.interface';

export interface KuUser extends User
{
  roles: KuUserRoles;
  profile: KuUserProfile;
}
