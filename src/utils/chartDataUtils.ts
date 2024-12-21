import { format, parse } from 'date-fns';

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface FormattedChartDataPoint extends ChartDataPoint {
  formattedDate: string;
  accumulatedReturn: number;
}

export const formatChartData = (data: ChartDataPoint[]): FormattedChartDataPoint[] => {
  const last12Months = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12);

  const startValue = last12Months[0]?.value || 0;
  
  return last12Months.map(item => {
    const accumulatedReturn = ((item.value - startValue) / startValue) * 100;
    return {
      ...item,
      formattedDate: format(parse(item.date, "yyyy-MM", new Date()), "MMM yyyy"),
      accumulatedReturn,
    };
  });
};

export const findYearChanges = (data: FormattedChartDataPoint[]): string[] => {
  return data.reduce((acc: string[], item, index) => {
    if (index > 0) {
      const currentYear = parse(item.date, "yyyy-MM", new Date()).getFullYear();
      const prevYear = parse(data[index - 1].date, "yyyy-MM", new Date()).getFullYear();
      if (currentYear !== prevYear) {
        acc.push(item.formattedDate);
      }
    }
    return acc;
  }, []);
};

export const calculateYAxisDomain = (values: number[]): [number, number] => {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = range * 0.1;
  
  return [
    minValue - padding,
    maxValue + padding
  ];
};