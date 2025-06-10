"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

type Reading = {
  id: number;
  date: Date;
  time: string;
  systolic: number;
  diastolic: number;
};

const database = process.env.DATABASE_URL || "";
const sql = neon(database);

/** Add a reading for the given user */
export async function addReading(userId: string | undefined, reading: Reading) {
  console.log("addReading params:", {
    userId,
    reading,
  });

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await sql`
      INSERT INTO readings (user_id, date, time, systolic, diastolic)
      VALUES (${userId}, ${reading.date}, ${reading.time}, ${reading.systolic}, ${reading.diastolic});
    `;
  } catch (error: any) {
    console.error("Failed to add reading", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    throw error;
  }
}

/** Get paginated readings for the given user */
export async function getReadings({
  userId,
  page = 1,
  limit = 25,
}: {
  userId: string;
  page?: number;
  limit?: number;
}) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const offset = (page - 1) * limit;

  try {
    return await sql`
      SELECT * FROM readings
      WHERE user_id = ${userId}
      ORDER BY date DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
  } catch (error: any) {
    console.error("Failed to get readings", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    throw error;
  }
}

/** Delete a reading by id for the given user */
export async function deleteReading(userId: string | undefined, id: number) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await sql`
      DELETE FROM readings
      WHERE id = ${id} AND user_id = ${userId};
    `;

    revalidatePath("/history");
  } catch (error: any) {
    console.error("Failed to delete reading", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    throw error;
  }
}

/** Get last 10 reading averages (AM or PM) for the given user */
export async function getLast10Averages(
  userId: string,
  timeOfDay: "AM" | "PM",
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const rows = await sql`
      SELECT
        AVG(systolic) AS avg_systolic,
        AVG(diastolic) AS avg_diastolic
      FROM (
        SELECT systolic, diastolic
        FROM readings
        WHERE user_id = ${userId} AND time = ${timeOfDay}
        ORDER BY date DESC
        LIMIT 10
      ) sub;
    `;

    // neon() returns rows as array of objects
    return rows[0];
  } catch (error: any) {
    console.error("Failed to get last 10 averages", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    throw error;
  }
}

/** Get readings for chart display for the given user */
export async function getReadingsForChart(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    return await sql`
      SELECT
        date,
        time,
        systolic,
        diastolic
      FROM readings
      WHERE user_id = ${userId}
      ORDER BY date ASC
      LIMIT 100;
    `;
  } catch (error: any) {
    console.error("Failed to get readings for chart", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      error,
    });
    throw error;
  }
}
