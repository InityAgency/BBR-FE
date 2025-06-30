import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Array<{
    date: string;
    views: number;
    leads: number;
  }>;
  title: string;
}

const GOLD = "#B3804C";

export function LineChart({ data, title }: LineChartProps) {
  return (
    <Card className="bg-secondary border-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pe-12">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={data}>
            <CartesianGrid stroke="#FFF" strokeOpacity={0.20} strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid #09090b",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke={GOLD}
              strokeWidth={2}
              dot={{ fill: GOLD, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Reviews"
            />
            <Line
              type="monotone"
              dataKey="leads"
              stroke={GOLD}
              strokeDasharray="4 2"
              strokeWidth={2}
              dot={{ fill: GOLD, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Leads"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 