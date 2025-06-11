import { type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const database = process.env.DATABASE_URL || "";
const sql = neon(database);

// get history
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  // const page = searchParams.get("page");
  // const limit = searchParams.get("limit");

  if (!userId) {
    throw new Error("User ID is required");
  }

  // const offset = (page - 1) * limit;

  try {
    const readings = await sql`
      SELECT * FROM readings
      WHERE user_id = ${userId}
      ORDER BY date DESC
      LIMIT 25 OFFSET 0;
    `;
    return NextResponse.json({
      success: true,
      readings: readings,
      error: null,
    });
  } catch (error: any) {
    console.error("Failed to get readings", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    return NextResponse.json({ success: false, readings: null, error });
  }
}
