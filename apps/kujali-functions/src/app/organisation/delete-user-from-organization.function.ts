import { FirestoreDeleteRegistrar } from '@ngfi/functions';

import { DeleteUserFromOrganizationHandler } from '@app/functions/organisation'; 

import { KujaliFunction } from '../../environments/kujali-func.class';

const USERS_PATH = 'users/{userId}';

const deleteUserFromOrganizationHandler = new DeleteUserFromOrganizationHandler()

export const deleteUserFromOrganization = new KujaliFunction('deleteUserFromOrganization',
                                                  new FirestoreDeleteRegistrar(USERS_PATH),
                                                  [],
                                                  deleteUserFromOrganizationHandler)
                                                  .build();