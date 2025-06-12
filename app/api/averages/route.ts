import { type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const database = process.env.DATABASE_URL || "";
const sql = neon(database);

// get readings
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const timeOfDay = searchParams.get("timeOfDay");
  const arm = searchParams.get("arm");

  if (!userId || !timeOfDay) {
    return NextResponse.json({
      success: false,
      readings: null,
      error: "User ID and time of day are required",
    });
  }

  try {
    const averages = await sql`
      SELECT
        AVG(systolic) AS avg_systolic,
        AVG(diastolic) AS avg_diastolic
      FROM (
             SELECT systolic, diastolic
             FROM readings
             WHERE user_id = ${userId} AND time = ${timeOfDay} AND arm = ${arm}
             ORDER BY date DESC
               LIMIT 10
           ) sub;
    `;
    return NextResponse.json({
      success: true,
      averages: averages[0],
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
