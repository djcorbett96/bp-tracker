"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

type Reading = {
  date: Date;
  time: string;
  systolic: number;
  diastolic: number;
};

const database = process.env.DATABASE_URL_PROD || "";

export async function addReading(reading: Reading) {
  const sql = neon(database);
  await sql`CREATE TABLE IF NOT EXISTS readings (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    systolic INTEGER NOT NULL,
    diastolic INTEGER NOT NULL
  )`;
  await sql`INSERT INTO readings (date, time, systolic, diastolic) VALUES (${reading.date}, ${reading.time}, ${reading.systolic}, ${reading.diastolic})`;
  console.log(
    `Reading added: ${reading.date} ${reading.time} ${reading.systolic}/${reading.diastolic}`
  );
}

export async function getReadings({
  page = 1,
  limit = 25,
}: {
  page?: number;
  limit?: number;
}) {
  const sql = neon(database);
  const readings =
    await sql`SELECT * FROM readings ORDER BY date DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  return readings;
}

export async function deleteReading(id: number) {
  const sql = neon(database);
  await sql`DELETE FROM readings WHERE id = ${id}`;
  revalidatePath("/history");
}

export async function getLast10Averages(timeOfDay: "AM" | "PM") {
  const sql = neon(database);
  const result = await sql`
    SELECT
      AVG(systolic) AS avg_systolic,
      AVG(diastolic) AS avg_diastolic
    FROM (
      SELECT systolic, diastolic
      FROM readings
      WHERE time = ${timeOfDay}
      ORDER BY date DESC
      LIMIT 10
    ) sub;
  `;
  return result[0];
}

export async function getReadingsForChart() {
  const sql = neon(database);

  const readings = await sql`
      SELECT
        date,
        time,
        systolic,
        diastolic
      FROM readings
      ORDER BY date ASC
      LIMIT 100
    `;

  return readings;
}
