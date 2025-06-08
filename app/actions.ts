"use server";

import { Pool } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

type Reading = {
  date: Date;
  time: string;
  systolic: number;
  diastolic: number;
};

const database = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString: database! });

/** Add a reading for the given user */
export async function addReading(userId: string | undefined, reading: Reading) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await pool.query(
    `INSERT INTO readings (user_id, date, time, systolic, diastolic)
         VALUES ($1, $2, $3, $4, $5)`,
    [userId, reading.date, reading.time, reading.systolic, reading.diastolic]
  );

  console.log(
    `Reading added for user ${userId}: ${reading.date} ${reading.time} ${reading.systolic}/${reading.diastolic}`
  );
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

  const { rows } = await pool.query(
    `SELECT * FROM readings WHERE user_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return rows;
}

/** Delete a reading by id for the given user */
export async function deleteReading(userId: string | undefined, id: number) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await pool.query(`DELETE FROM readings WHERE id = $1 AND user_id = $2`, [
    id,
    userId,
  ]);

  revalidatePath("/history");
}

/** Get last 10 reading averages (AM or PM) for the given user */
export async function getLast10Averages(
  userId: string,
  timeOfDay: "AM" | "PM"
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { rows } = await pool.query(
    `
      SELECT
        AVG(systolic) AS avg_systolic,
        AVG(diastolic) AS avg_diastolic
      FROM (
        SELECT systolic, diastolic
        FROM readings
        WHERE user_id = $1 AND time = $2
        ORDER BY date DESC
        LIMIT 10
      ) sub;
      `,
    [userId, timeOfDay]
  );

  return rows[0];
}

/** Get readings for chart display for the given user */
export async function getReadingsForChart(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { rows } = await pool.query(
    `
      SELECT
        date,
        time,
        systolic,
        diastolic
      FROM readings
      WHERE user_id = $1
      ORDER BY date ASC
      LIMIT 100
      `,
    [userId]
  );

  return rows;
}
