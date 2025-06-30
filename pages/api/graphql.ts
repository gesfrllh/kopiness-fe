import { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/graphql': '/graphql',
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return proxy(req, res, () => {});
}
