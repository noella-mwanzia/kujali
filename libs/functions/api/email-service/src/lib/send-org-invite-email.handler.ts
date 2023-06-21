import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

export class SendOrgInviteEmailHandler extends FunctionHandler<any, void> {
  private _tools: HandlerTools;

  public async execute(mailData: any, context: FunctionContext, tools: HandlerTools) 
  {
    this._tools = tools;

    this._tools.Logger.debug(() => `Beginning Execution, Sending Org Invite Email`);

    try {
      let mailsRepo = this._tools.getRepository<any>(
        `orgs/${mailData.orgId}/mails`
      );
  
      mailsRepo.create(mailData);

    } catch (e) {
      this._tools.Logger.log(() => `Send Email Failed due to: ${e}`);
    }
  }
}
