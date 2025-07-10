import { ApolloError } from "@apollo/client"

export function formatError(err: unknown): string {
  if (!err || typeof err !== 'object') return ''

  if (err instanceof ApolloError) {
    return err.graphQLErrors?.[0]?.message || 'Network error'
  }
  if (err instanceof Error) return err.message
  return String(err)
}