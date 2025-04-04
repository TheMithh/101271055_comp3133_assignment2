import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { environment } from '../../environments/environment';

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
          withCredentials: true, // Important for CORS with credentials
        });
        
        // Error handling link
        const errorLink = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              );
            });
          }
          if (networkError) {
            console.error(`[Network error]: ${networkError}`);
          }
        });
        
        return {
          link: errorLink.concat(http),
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all'
            },
            query: {
              fetchPolicy: 'network-only',
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