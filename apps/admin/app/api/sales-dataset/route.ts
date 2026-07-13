import { NextResponse } from "next/server";
import { getSalesDataset } from "@/app/server/getBaseData";

export async function GET() {
  const data = await getSalesDataset();
  return NextResponse.json(data);
}
