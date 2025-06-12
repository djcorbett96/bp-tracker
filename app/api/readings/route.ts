import { type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const database = process.env.DATABASE_URL || "";
const sql = neon(database);

// get readings
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  // const page = searchParams.get("page");
  // const limit = searchParams.get("limit");

  if (!userId) {
    return NextResponse.json({
      success: false,
      readings: null,
      error: "User ID is required",
    });
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
// create reading
export async function POST(request: NextRequest) {
  const res = await request.json();

  const reading = res.values;
  const userId = res.user;

  if (!userId) {
    return NextResponse.json({
      success: false,
      readings: null,
      error: "User ID is required",
    });
  }

  try {
    const newReading = await sql`
      INSERT INTO readings (user_id, date, time, arm, systolic, diastolic)
      VALUES (${userId}, ${reading.date}, ${reading.time}, ${reading.arm}, ${reading.systolic}, ${reading.diastolic});
    `;
    console.log("newReading", newReading);
    return NextResponse.json({
      success: true,
      data: newReading,
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
// delete reading
export async function DELETE(request: NextRequest) {
  const res = await request.json();
  const readingId = res.readingId;
  const userId = res.user;

  if (!userId || !readingId) {
    return NextResponse.json({
      success: false,
      readings: null,
      error: "User ID and Reading ID are required",
    });
  }

  try {
    const deleteResponse = await sql`
      DELETE FROM readings
      WHERE id = ${readingId} AND user_id = ${userId};
    `;
    return NextResponse.json({
      success: true,
      data: deleteResponse,
      error: null,
    });
  } catch (error: any) {
    console.error("Failed to delete readings", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    return NextResponse.json({ success: false, readings: null, error });
  }
}
