"use server";

import { Pool } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

type Reading = {
  date: Date;
  time: string;
  systolic: number;
  diastolic: number;
};

const database = process.env.DATABASE_URL_PROD || "";
const pool = new Pool({ connectionString: database! });

export async function addReading(reading: Reading) {
  try {
    await pool.query(
      `INSERT INTO readings (date, time, systolic, diastolic)
           VALUES ($1, $2, $3, $4)`,
      [reading.date, reading.time, reading.systolic, reading.diastolic]
    );

    console.log(
      `Reading added: ${reading.date} ${reading.time} ${reading.systolic}/${reading.diastolic}`
    );
  } catch (error) {
    console.error("Failed to add reading", error);
  }
}

export async function getReadings({
  page = 1,
  limit = 25,
}: {
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT * FROM readings ORDER BY date DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return rows;
}

export async function deleteReading(id: number) {
  await pool.query(`DELETE FROM readings WHERE id = $1`, [id]);

  revalidatePath("/history");
}

export async function getLast10Averages(timeOfDay: "AM" | "PM") {
  const { rows } = await pool.query(
    `
      SELECT
        AVG(systolic) AS avg_systolic,
        AVG(diastolic) AS avg_diastolic
      FROM (
        SELECT systolic, diastolic
        FROM readings
        WHERE time = $1
        ORDER BY date DESC
        LIMIT 10
      ) sub;
      `,
    [timeOfDay]
  );

  return rows[0];
}

export async function getReadingsForChart() {
  const { rows } = await pool.query(
    `
      SELECT
        date,
        time,
        systolic,
        diastolic
      FROM readings
      ORDER BY date ASC
      LIMIT 100
      `
  );

  return rows;
}
