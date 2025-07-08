import client from "../../lib/apollo";
import Cookies from 'js-cookie'
import { LOGIN_MUTATION } from "@/graphql/mutations/login";

interface AuthPayload {
  token: string,
  user: { id: string, name: string }
}

export const login = async (input: { email: string; password: string }) => {
  const res = await client.mutate<{ login: AuthPayload }, { input: { email: string; password: string } }>({
    mutation: LOGIN_MUTATION,
    variables: { input },
  });

  if (!res.data) throw new Error("No Data Returned");

  Cookies.set("token", res.data.login.token, { expires: 1 });
  return res.data;
};
