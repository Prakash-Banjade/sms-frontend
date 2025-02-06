import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const financeData = Array.from({ length: 12 }).map((_, i) => ({
    month: i + 1,
    income: 2700 + Math.random() * 900,
    expense: 1800 + Math.random() * 900,
}))

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
    },
    expense: {
        label: "Expense",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function Dashboard_IncomeExpenseChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Income vs Expense</CardTitle>
                <CardDescription>Monthly financial overview</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className='w-full h-auto'>
                    <LineChart
                        accessibilityLayer
                        data={financeData}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line
                            dataKey="income"
                            type="monotone"
                            stroke="hsl(var(--success))"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="expense"
                            type="monotone"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}