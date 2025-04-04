import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { environment } from '../../environments/environment';

// In graphql.module.ts
@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        // Create the http link
        const http = httpLink.create({
          uri: environment.apiUrl,
        });
        
        // Error handling link
        const errorLink = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            console.log('GraphQL Errors:', graphQLErrors);
          }
          if (networkError) {
            console.log('Network Error:', networkError);
          }
        });
        
        return {
          link: errorLink.concat(http),
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all'
            },
            query: {
              fetchPolicy: 'no-cache',
              errorPolicy: 'all'
            },
            mutate: {
              errorPolicy: 'all'
            }
          }
        };
      },
      deps: [HttpLink],
    },
  ]
})
export class ApolloGraphQLModule { }