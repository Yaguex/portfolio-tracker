import { MetricsCard } from "@/components/MetricsCard";
import { PortfolioHistoryTable } from "@/components/PortfolioHistoryTable";
import { PortfolioValueChart } from "@/components/PortfolioValueChart";

const MOCK_DATA = {
  portfolioValue: 125000,
  totalGain: 25000,
  gainPercentage: 25,
  historicalValues: [
    { date: '2024-04', value: 125000 },
    { date: '2024-03', value: 122000 },
    { date: '2024-02', value: 118000 },
    { date: '2024-01', value: 115000 },
    { date: '2023-12', value: 110000 },
    { date: '2023-11', value: 105000 },
    { date: '2023-10', value: 100000 },
    { date: '2023-09', value: 98000 },
    { date: '2023-08', value: 95000 },
    { date: '2023-07', value: 90000 },
    { date: '2023-06', value: 87500 },
    { date: '2023-05', value: 85000 },
    { date: '2023-04', value: 65000 },
    { date: '2023-03', value: 62000 },
    { date: '2023-02', value: 60000 },
    { date: '2023-01', value: 58000 },
    { date: '2022-12', value: 55000 },
    { date: '2022-11', value: 52000 },
    { date: '2022-10', value: 50000 },
    { date: '2022-09', value: 48000 },
    { date: '2022-08', value: 45000 },
    { date: '2022-07', value: 42000 },
    { date: '2022-06', value: 40000 },
    { date: '2022-05', value: 38000 },
    { date: '2022-04', value: 35000 },
    { date: '2022-03', value: 32000 },
    { date: '2022-02', value: 30000 },
    { date: '2022-01', value: 28000 },
    { date: '2021-12', value: 25000 },
    { date: '2021-11', value: 22000 },
    { date: '2021-10', value: 20000 },
    { date: '2021-09', value: 18000 },
    { date: '2021-08', value: 15000 },
    { date: '2021-07', value: 12000 },
  ]
};

const Dashboard = () => {
  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <MetricsCard
          title="Portfolio Value"
          value={`$${MOCK_DATA.portfolioValue.toLocaleString()}`}
        />
        <MetricsCard
          title="Total Gain/Loss"
          value={`$${MOCK_DATA.totalGain.toLocaleString()}`}
          trend={MOCK_DATA.totalGain >= 0 ? "up" : "down"}
        />
        <MetricsCard
          title="Return"
          value={`${MOCK_DATA.gainPercentage}%`}
          trend={MOCK_DATA.gainPercentage >= 0 ? "up" : "down"}
        />
      </div>

      <div className="mb-8">
        <PortfolioValueChart data={MOCK_DATA.historicalValues} />
      </div>

      <div className="mb-8">
        <PortfolioHistoryTable data={MOCK_DATA.historicalValues} />
      </div>
    </div>
  );
};

export default Dashboard;
