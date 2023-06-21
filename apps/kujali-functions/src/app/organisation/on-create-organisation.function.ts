import { FirestoreCreateRegistrar, RestRegistrar } from '@ngfi/functions';

import { OrganisationAssignUserHandler } from '@app/functions/organisation';

import { KujaliFunction } from '../../environments/kujali-func.class';

const ORGANIZATIONS_PATH = 'orgs/{orgId}';

const organisationAssignHandler = new OrganisationAssignUserHandler()

export const assignUserToOrg = new KujaliFunction('assignUserToOrg',
                                                  new FirestoreCreateRegistrar(ORGANIZATIONS_PATH),
                                                  [],
                                                  organisationAssignHandler)
                                                  .build()
