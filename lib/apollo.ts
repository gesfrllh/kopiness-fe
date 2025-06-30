import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const client = new ApolloClient({
  link: createUploadLink({
    uri: '/api/graphql',
    credentials: 'include'
  }),
  cache: new InMemoryCache()
})

export default client