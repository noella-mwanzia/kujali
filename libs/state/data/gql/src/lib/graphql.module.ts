import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

import { InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { FetchDbRecordsService } from './services/fetch-db-records.service';
import { GqlDataProvider } from './providers/gql-data-provider';

@NgModule({
  imports: [CommonModule],
  providers: [FetchDbRecordsService, GqlDataProvider]
})

export class GraphQlModule {
  static forRoot(graphqlUrl: string): ModuleWithProviders<GraphQlModule> {
    return {
      ngModule: GraphQlModule,
      providers: [
        {
          provide: APOLLO_OPTIONS,
          useFactory: (httpLink: HttpLink) => {
            return {
              cache: new InMemoryCache(),
              link: httpLink.create({
                uri: graphqlUrl,
                headers: new HttpHeaders({
                  'x-hasura-admin-secret':'jce1mfwxXQzZvYsSxJGs9SnffM9EZqfaB5jefjYkMFJloDJZmlg7KVUnad0aF8VY',
                  Authorization: 'Bearer jce1mfwxXQzZvYsSxJGs9SnffM9EZqfaB5jefjYkMFJloDJZmlg7KVUnad0aF8VY'
                })
              }),
            };
          },
          deps: [HttpLink],
        }
      ]
    };
  }
}
