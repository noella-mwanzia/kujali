import { FirestoreCreateRegistrar, RestRegistrar } from '@ngfi/functions';

import { CreateNewUserHandler } from '@app/functions/users';

import { KujaliFunction } from '../../environments/kujali-func.class';

const createNewUserHandler = new CreateNewUserHandler()

export const createNewUser = new KujaliFunction('createNewUser',
                                                  new RestRegistrar(),
                                                  [],
                                                  createNewUserHandler)
                                                  .build()
