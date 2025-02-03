import { Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { category: 'Food', amount: 10000, fill: 'var(--color-Food)' },
  {
    category: 'Entertainment',
    amount: 2000,
    fill: 'var(--color-Entertainment)',
  },
  { category: 'Rent', amount: 9000, fill: 'var(--color-Rent)' },
  { category: 'Health', amount: 1000, fill: 'var(--color-edge)' },
  { category: 'other', amount: 5000, fill: 'var(--color-other)' },
];

const chartConfig = {
  Spendings: {
    label: 'Spendings',
  },
  Food: {
    label: 'Food',
    color: 'hsl(var(--chart-1))',
  },
  Entertainment: {
    label: 'Entertainment',
    color: 'hsl(var(--chart-2))',
  },
  Rent: {
    label: 'Rent',
    color: 'hsl(var(--chart-3))',
  },
  Health: {
    label: 'Health',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;
export default function PersonalSpendingCard() {
  return (
    <section className='text-center'>
      <ChartContainer
        config={chartConfig}
        className='mx-auto aspect-square max-h-[200px] min-w-[300px]'
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey='amount'
            labelLine={true}
            label={({ payload, ...props }) => {
              return (
                <text
                  cx={props.cx}
                  cy={props.cy}
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                  fill='hsla(var(--muted-foreground))'
                >
                  {`Rs. ${payload.amount}`}
                </text>
              );
            }}
            nameKey='category'
            innerRadius={50}
          />
        </PieChart>
      </ChartContainer>
      <div className='mt-2 w-full'>
        Total Earnings: <span className='font-semibold'>Rs.10,000</span>
      </div>
      <div className='w-full'>
        Total Spends: <span className='font-semibold'>Rs.10,000</span>
      </div>
      <div className='w-full'>
        Total Debt: <span className='font-semibold'>Rs.5,000</span>
      </div>
    </section>
  );
}
