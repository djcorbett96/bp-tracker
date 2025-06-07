"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Reading {
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
}

interface ReadingsLineChartProps {
  data: Reading[];
}

export function ReadingsLineChart({ data }: ReadingsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="systolic" stroke="#000000" />
        <Line type="monotone" dataKey="diastolic" stroke="#000000" />
      </LineChart>
    </ResponsiveContainer>
  );
}
