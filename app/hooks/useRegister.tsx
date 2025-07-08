import { REGISTER_MUTATION } from "@/graphql/mutations/register";
import client from "@/lib/apollo";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "CUSTOMER";
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export const register = async (input: RegisterInput) => {
  const res = await client.mutate<
    { register: User },
    { input: RegisterInput }
  >({
    mutation: REGISTER_MUTATION,
    variables: { input },
  });

  if (!res.data) throw new Error("No data returned");

  return res.data.register;
};
