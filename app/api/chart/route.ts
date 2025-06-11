import { type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const database = process.env.DATABASE_URL || "";
const sql = neon(database);

// get readings
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({
      success: false,
      readings: null,
      error: "User ID is required",
    });
  }

  try {
    const readings = await sql`
      SELECT * FROM readings
      WHERE user_id = ${userId}
      ORDER BY date DESC
        LIMIT 100;
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
