declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';

  interface UploadLinkOptions {
    uri?: string;
    headers?: Record<string, string>;
    credentials?: 'include' | 'omit' | 'same-origin';
  }

  export function createUploadLink(options?: UploadLinkOptions): ApolloLink;
}
