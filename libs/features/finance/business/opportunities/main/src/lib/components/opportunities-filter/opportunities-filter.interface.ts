/**
 * Selected filter header options for opps page.
 */
 export interface OpportunitiesFilter 
 {
   isFiltered: boolean;
 
   allowedAssigned: string[];
   allowedTypes: string[];
   allowedCompanies: string[];
   allowedContacts: string[];
   allowedDeadline: any;
   allowedTags: string[];
   allowedStatus: string[];
 
   /** String-based filter for the remaining allowed opps after initial filter. */
   search: string;
 }
 
 export function __NullOpportunityFilter() : OpportunitiesFilter
 {
   return {
     isFiltered: false,
 
     allowedAssigned: [],
     allowedTypes: [],
     allowedCompanies: [],
     allowedContacts: [],
     allowedDeadline: '',
     allowedTags: [],
     allowedStatus: [],
 
     search: ''
   }
 }