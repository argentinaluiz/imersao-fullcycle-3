// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import http from "../../../../../http";
import { Invoice } from "../../../../../models";

export default async (req: NextApiRequest, res: NextApiResponse<Invoice[]>) => {
  const { number } = req.query;

  const { data: invoices } = await http.get(`credit-cards/${number}/invoices`);
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=59");
  res.status(200).json(invoices);
};
