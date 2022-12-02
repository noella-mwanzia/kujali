import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { Apollo, Query, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class FetchDbRecordsService {

  constructor(private _apollo: Apollo) { }

  get(tableName: string, dataColumns: string): any {
    const GET = gql`query GET_${tableName.toUpperCase()} {${tableName} ${dataColumns}}`;

    return this._apollo.watchQuery<Query>({query: GET}).valueChanges.pipe(map((payLoad) => payLoad.data));
  }

  add(createObject: any) {
    // WIP (query not complete)
    const MUT = gql`mutation insert_budgets {
      insert_budgets(objects: { id: ${createObject.id}, name: ${createObject.name}})
      {
        returning {
          id
          name
        }
      }
    }`;    
    return this._apollo.mutate({
      mutation: MUT 
    })
  }
}
