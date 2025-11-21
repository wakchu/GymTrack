import React from 'react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface ChartData {
    name: string;
    value: number;
}

interface ProgressChartProps {
    data: ChartData[];
    color?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
    data,
    color = "#39FF14"
}) => {
    return (
        <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        hide
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        hide
                        axisLine={false}
                        tickLine={false}
                        domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        itemStyle={{ color: color }}
                        cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
