"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, Save } from "lucide-react"
import EvaluationChart from "@/components/evaluation-chart"

export default function TeacherEvaluation() {
  const [rows, setRows] = useState<string[]>(["Teacher 1", "Teacher 2"])
  const [columns, setColumns] = useState<string[]>(["Teaching Quality", "Communication", "Engagement"])
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({})
  const [newRowName, setNewRowName] = useState("")
  const [newColumnName, setNewColumnName] = useState("")

  // Initialize scores when rows or columns change
  useEffect(() => {
    const initialScores: Record<string, Record<string, number>> = {}
    rows.forEach((row) => {
      initialScores[row] = initialScores[row] || {}
      columns.forEach((col) => {
        initialScores[row][col] = initialScores[row]?.[col] || 0
      })
    })
    setScores(initialScores)
  }, [])

  const handleScoreChange = (row: string, col: string, value: string) => {
    const numValue = value === "" ? 0 : Number(value)
    setScores((prev) => ({
      ...prev,
      [row]: {
        ...prev[row],
        [col]: numValue,
      },
    }))
  }

  const addRow = () => {
    if (newRowName.trim() === "") return
    setRows((prev) => [...prev, newRowName])

    // Initialize scores for new row
    setScores((prev) => {
      const newRowScores: Record<string, number> = {}
      columns.forEach((col) => {
        newRowScores[col] = 0
      })
      return {
        ...prev,
        [newRowName]: newRowScores,
      }
    })

    setNewRowName("")
  }

  const addColumn = () => {
    if (newColumnName.trim() === "") return
    setColumns((prev) => [...prev, newColumnName])

    // Initialize scores for new column
    setScores((prev) => {
      const updatedScores = { ...prev }
      rows.forEach((row) => {
        updatedScores[row] = {
          ...updatedScores[row],
          [newColumnName]: 0,
        }
      })
      return updatedScores
    })

    setNewColumnName("")
  }

  const removeRow = (index: number) => {
    const rowToRemove = rows[index]
    setRows((prev) => prev.filter((_, i) => i !== index))

    // Remove scores for deleted row
    setScores((prev) => {
      const newScores = { ...prev }
      delete newScores[rowToRemove]
      return newScores
    })
  }

  const removeColumn = (index: number) => {
    const colToRemove = columns[index]
    setColumns((prev) => prev.filter((_, i) => i !== index))

    // Remove scores for deleted column
    setScores((prev) => {
      const newScores = { ...prev }
      Object.keys(newScores).forEach((row) => {
        const { [colToRemove]: _, ...rest } = newScores[row]
        newScores[row] = rest
      })
      return newScores
    })
  }

  const calculateRowTotal = (row: string) => {
    return Object.values(scores[row] || {}).reduce((sum, score) => sum + score, 0)
  }

  const calculateColumnAverage = (col: string) => {
    const colScores = rows.map((row) => scores[row]?.[col] || 0)
    const sum = colScores.reduce((acc, score) => acc + score, 0)
    return colScores.length > 0 ? sum / colScores.length : 0
  }

  const saveEvaluation = () => {
    const data = {
      rows,
      columns,
      scores,
    }
    localStorage.setItem("teacherEvaluation", JSON.stringify(data))
    alert("Evaluation data saved!")
  }

  const loadEvaluation = () => {
    const savedData = localStorage.getItem("teacherEvaluation")
    if (savedData) {
      const { rows: savedRows, columns: savedColumns, scores: savedScores } = JSON.parse(savedData)
      setRows(savedRows)
      setColumns(savedColumns)
      setScores(savedScores)
    }
  }

  // Load saved data on initial render
  useEffect(() => {
    loadEvaluation()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Teacher Evaluation System</h1>

      <Tabs defaultValue="evaluation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="evaluation">Evaluation Table</TabsTrigger>
          <TabsTrigger value="results">Results & Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluation" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Add Teacher/Row</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  placeholder="Enter teacher name"
                  value={newRowName}
                  onChange={(e) => setNewRowName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRow()}
                />
                <Button onClick={addRow}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Add Criteria/Column</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  placeholder="Enter evaluation criteria"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addColumn()}
                />
                <Button onClick={addColumn}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Evaluation Table</span>
                <Button onClick={saveEvaluation} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Teachers</th>
                      {columns.map((col, index) => (
                        <th key={index} className="border p-2 text-left relative">
                          <div className="flex items-center justify-between">
                            <Input
                              value={col}
                              onChange={(e) => {
                                const newColumns = [...columns]
                                newColumns[index] = e.target.value
                                setColumns(newColumns)
                              }}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColumn(index)}
                              className="h-6 w-6 absolute right-1 top-1"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </th>
                      ))}
                      <th className="border p-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2 relative">
                          <div className="flex items-center justify-between">
                            <Input
                              value={row}
                              onChange={(e) => {
                                const newRows = [...rows]
                                const oldRowName = newRows[rowIndex]
                                newRows[rowIndex] = e.target.value
                                setRows(newRows)

                                // Update scores with new row name
                                setScores((prev) => {
                                  const { [oldRowName]: oldScores, ...rest } = prev
                                  return {
                                    ...rest,
                                    [e.target.value]: oldScores,
                                  }
                                })
                              }}
                              className="border-0 p-0 h-auto bg-transparent"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRow(rowIndex)}
                              className="h-6 w-6 absolute right-1 top-1"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                        {columns.map((col, colIndex) => (
                          <td key={colIndex} className="border p-2">
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              value={scores[row]?.[col] || 0}
                              onChange={(e) => handleScoreChange(row, col, e.target.value)}
                              className="w-full"
                            />
                          </td>
                        ))}
                        <td className="border p-2 font-bold">{calculateRowTotal(row)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted font-bold">
                      <td className="border p-2">Average</td>
                      {columns.map((col, index) => (
                        <td key={index} className="border p-2">
                          {calculateColumnAverage(col).toFixed(1)}
                        </td>
                      ))}
                      <td className="border p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <EvaluationChart rows={rows} columns={columns} scores={scores} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
