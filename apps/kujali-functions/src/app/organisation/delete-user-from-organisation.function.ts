import { FirestoreDeleteRegistrar } from '@ngfi/functions';

import { DeleteUserFromOrganisationHandler } from '@app/functions/organisation'; 

import { KujaliFunction } from '../../environments/kujali-func.class';

const USERS_PATH = 'users/{userId}';

const deleteUserFromOrganisationHandler = new DeleteUserFromOrganisationHandler()

export const deleteUserFromOrganisation = new KujaliFunction('deleteUserFromOrganisation',
                                                  new FirestoreDeleteRegistrar(USERS_PATH),
                                                  [],
                                                  deleteUserFromOrganisationHandler)
                                                  .build();