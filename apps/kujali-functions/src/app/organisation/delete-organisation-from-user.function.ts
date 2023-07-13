import { FirestoreDeleteRegistrar } from '@ngfi/functions';

import { DeleteOrganisationFromUserHandler } from '@app/functions/organisation'; 

import { KujaliFunction } from '../../environments/kujali-func.class';

const ORG_PATH = 'orgs/{orgId}';

const deleteOrganisationFromUserHandler = new DeleteOrganisationFromUserHandler()

export const deleteOrganisationFromUser = new KujaliFunction('deleteOrganisationFromUser',
                                                  new FirestoreDeleteRegistrar(ORG_PATH),
                                                  [],
                                                  deleteOrganisationFromUserHandler)
                                                  .build();