import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { KuUser } from '@app/model/common/user';

export class DeleteUserFromOrganisationHandler extends FunctionHandler<KuUser, any>
{

  public async execute(user: KuUser, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting delete user execution`);
    tools.Logger.log(() => `deleting user with id: ${user.id}`);

    let orgsRepo = tools.getRepository(`orgs`);
    let userOrgs = user.profile.orgIds;

    tools.Logger.log(() => `user orgs are : ${userOrgs.length}`);

    for await (const org of userOrgs) {
      let orgData: any = await orgsRepo.getDocumentById(org);
      tools.Logger.log(() => `User org is : ${orgData.id}`);

      if (orgData.createdBy === user.id) {
        tools.Logger.log(() => `user created org: ${orgData.id}`);
        await orgsRepo.delete(orgData.id);
      } else {
        tools.Logger.log(() => `updating org: ${orgData.id}`);
        orgData.users.splice(orgData.users.indexOf(user.id), 1);
        await orgsRepo.update(orgData);
      }
    }
  }
}