import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

interface BarChartProps {
  data: Array<{
    name: string;
    views?: number;
    leads?: number;
    rankingScore?: number;
  }>;
  title: string;
}

const GOLD = "#B3804C";

export function BarChart({ data, title }: BarChartProps) {
  // Proveravamo da li treba prikazati rankingScore
  const showRanking = data.length > 0 && typeof data[0].rankingScore === "number";
  
  return (
    <Card className="bg-secondary border-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data}>
            <CartesianGrid stroke="#FFF" strokeOpacity={0.20} strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
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
                color: "#fff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              cursor={false}
            />
            {showRanking ? (
              <Bar 
                dataKey="rankingScore" 
                fill={GOLD}
                radius={[4, 4, 0, 0]}
                name="Ranking Score"
              />
            ) : (
              <>
                <Bar 
                  dataKey="views" 
                  fill={GOLD}
                  radius={[4, 4, 0, 0]}
                  name="Reviews"
                />
                <Bar 
                  dataKey="leads" 
                  fill={GOLD}
                  radius={[4, 4, 0, 0]}
                  name="Leads"
                  opacity={0.5}
                />
              </>
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 