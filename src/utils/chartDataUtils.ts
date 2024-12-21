import { format, parse } from 'date-fns';

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface FormattedDataPoint extends ChartDataPoint {
  formattedDate: string;
  accumulatedReturn: number;
}

export const formatChartData = (data: ChartDataPoint[]): FormattedDataPoint[] => {
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const last12Months = sortedData.slice(-12);
  const startValue = last12Months[0]?.value || 0;

  return last12Months.map(item => ({
    ...item,
    formattedDate: format(parse(item.date, "yyyy-MM", new Date()), "MMM yyyy"),
    accumulatedReturn: ((item.value - startValue) / startValue) * 100,
  }));
};

export const calculateYAxisDomain = (values: number[]): [number, number] => {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = range * 0.1;

  return [
    Math.floor(minValue - padding),
    Math.ceil(maxValue + padding)
  ];
};