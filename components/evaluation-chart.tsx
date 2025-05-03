"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface EvaluationChartProps {
  rows: string[]
  columns: string[]
  scores: Record<string, Record<string, number>>
}

export default function EvaluationChart({ rows, columns, scores }: EvaluationChartProps) {
  // Prepare data for bar chart (by teacher)
  const barData = rows.map((row) => {
    const data: Record<string, any> = { name: row }
    columns.forEach((col) => {
      data[col] = scores[row]?.[col] || 0
    })
    return data
  })

  // Prepare data for radar chart
  const radarData = rows.map((row) => {
    const data: Record<string, any> = { teacher: row }
    columns.forEach((col) => {
      data[col] = scores[row]?.[col] || 0
    })
    return data
  })

  // Prepare data for pie chart (total scores by teacher)
  const pieData = rows.map((row) => {
    const total = Object.values(scores[row] || {}).reduce((sum, score) => sum + score, 0)
    return {
      name: row,
      value: total,
    }
  })

  // Prepare data for column comparison chart
  const columnData = columns.map((col) => {
    const data: Record<string, any> = { name: col }
    rows.forEach((row) => {
      data[row] = scores[row]?.[col] || 0
    })
    return data
  })

  // Generate random colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="column">Column Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Evaluation Scores by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {columns.map((column, index) => (
                      <Bar key={column} dataKey={column} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={150} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="teacher" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    {columns.map((column, index) => (
                      <Radar
                        key={column}
                        name={column}
                        dataKey={column}
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.6}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Total Scores Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`Score: ${value}`, "Total"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="column">
          <Card>
            <CardHeader>
              <CardTitle>Criteria Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={columnData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    {rows.map((row, index) => (
                      <Bar key={row} dataKey={row} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
