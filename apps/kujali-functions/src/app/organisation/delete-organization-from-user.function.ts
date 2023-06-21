import { FirestoreDeleteRegistrar } from '@ngfi/functions';

import { DeleteOrganizationFromUserHandler } from '@app/functions/organisation'; 

import { KujaliFunction } from '../../environments/kujali-func.class';

const ORG_PATH = 'orgs/{orgId}';

const deleteOrganizationFromUserHandler = new DeleteOrganizationFromUserHandler()

export const deleteOrganizationFromUser = new KujaliFunction('deleteOrganizationFromUser',
                                                  new FirestoreDeleteRegistrar(ORG_PATH),
                                                  [],
                                                  deleteOrganizationFromUserHandler)
                                                  .build();