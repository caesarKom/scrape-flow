"use client"

import { GetCreditsUsageInPeriod } from "@/actions/analytics/get-credits-usage-in-period"
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
import { ChartColumnIcon, Layers2 } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>

export const CreditsUsageChart = ({
  data,
  title,
  description,
}: {
  data: ChartData
  title: string
  description: string
}) => {
  const chartConfig = {
    success: {
      label: "Successfull Phase credits",
      color: "hsl(--var(--chart-2))",
    },
    failed: {
      label: "Failed Phasr credits",
      color: "hsl(--var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnIcon className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
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
            <Bar
              dataKey={"success"}
              radius={[0, 0, 4, 4]}
              fill="#25be35"
              fillOpacity={0.8}
              stroke="#25be35"
              stackId="a"
            />
            <Bar
              dataKey={"failed"}
              radius={[4, 4, 0, 0]}
              fill="#f33960"
              fillOpacity={0.8}
              stroke="#f33960"
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
