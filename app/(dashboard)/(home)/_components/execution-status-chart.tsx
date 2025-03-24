"use client"

import { GetWorkflowExecutionStatus } from "@/actions/analytics/get-Workflow-execution-status"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Layers2 } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStatus>>

export const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
  const chartConfig = {
    success: {
      label: "Success",
      color: "hsl(--var(--chart-2))",
    },
    failed: {
      label: "failed",
      color: "hsl(--var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2 className="size-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Daily number of successfull and failed workflow executions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-Us", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Area
              dataKey={"success"}
              min={0}
              type={"bump"}
              fill="#25be35"
              fillOpacity={0.6}
              stroke="#25be35"
              stackId="a"
            />
            <Area
              dataKey={"failed"}
              min={0}
              type={"bump"}
              fill="#f33960"
              fillOpacity={0.6}
              stroke="#f33960"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
