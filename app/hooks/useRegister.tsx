import { gql } from "@apollo/client";
import client from "../../lib/apollo";
import Cookies from 'js-cookie'

interface AuthRegisterPayload {
  token: string,
  user: {id: string, name: string}
}
const LOGIN_MUTATION = gql`
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

export const login = async (input: { email: string; password: string }) => {
  const res = await client.mutate<{ login: AuthRegisterPayload }, { input: { email: string; password: string } }>({
    mutation: LOGIN_MUTATION,
    variables: { input },
  });

  if (!res.data) throw new Error("No Data Returned");

  Cookies.set("token", res.data.login.token, { expires: 1 });
  return res.data;
};
