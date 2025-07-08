import { gql } from "@apollo/client"

export const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!){
    login(input: $input) {
      token,
      user {
        id
        name
      }
    }
  }
`