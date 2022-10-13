import { UserProfile } from '@iote/bricks';

export interface KuUserProfile extends UserProfile 
{
  /** Budgets the user has access too. */
  budgets: { 
    [id: string]: { 
      view: boolean, 
      edit: boolean
    } 
  }; 
}
