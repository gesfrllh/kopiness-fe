import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation register($input: RegisterInput!){
    register(input: $input){
        id
        name
        email
        role
    }
  }
`;