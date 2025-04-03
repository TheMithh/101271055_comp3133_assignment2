import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from '../../environments/environment';

// Use environment variable instead of hardcoded URL
const uri = environment.apiUrl;

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri,
          }),
        };
      },
      deps: [HttpLink],
    },
  ]
})
export class ApolloGraphQLModule { }