import { RestRegistrar } from '@ngfi/functions';

import { SendOrgInviteEmailHandler } from '@app/functions/api/email-service';

import { KujaliFunction } from '../../../environments/kujali-func.class';

const orgInviteEmailHandler = new SendOrgInviteEmailHandler();


export const sendOrgInvitesEmail = new KujaliFunction('sendOrgInvitesEmail',
                                          new RestRegistrar(),
                                          [],
                                          orgInviteEmailHandler)
                                          .build()