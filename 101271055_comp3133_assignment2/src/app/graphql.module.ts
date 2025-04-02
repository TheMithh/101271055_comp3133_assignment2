// src/app/graphql.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule]
})
export class GraphQLModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    // Create a basic HTTP link
    const http = this.httpLink.create({
      uri: 'http://localhost:5000/graphql'
    });

    // Add auth headers
    const auth = setContext((_, { headers }) => {
      // Get the authentication token from local storage if it exists
      const token = localStorage.getItem('token');
      
      // Return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        }
      };
    });

    // Create apollo client
    this.apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
    });
  }
}