import { FirestoreCreateRegistrar, RestRegistrar } from '@ngfi/functions';

import { OrganizationAssignUserHandler } from '@app/functions/organization';

import { KujaliFunction } from '../../environments/kujali-func.class';

const ORGANIZATIONS_PATH = 'orgs/{orgId}';

const organizationAssignHandler = new OrganizationAssignUserHandler()

export const assignUserToOrg = new KujaliFunction('assignUserToOrg',
                                                  new FirestoreCreateRegistrar(ORGANIZATIONS_PATH),
                                                  [],
                                                  organizationAssignHandler)
                                                  .build()
