import { MetricsCard } from "@/components/MetricsCard";
import { PortfolioValueChart } from "@/components/PortfolioValueChart";

const MOCK_DATA = {
  portfolioValue: 125000,
  totalGain: 25000,
  gainPercentage: 25,
  historicalValues: [
    { date: '2023-03', value: 85000 },
    { date: '2023-04', value: 87500 },
    { date: '2023-05', value: 90000 },
    { date: '2023-06', value: 95000 },
    { date: '2023-07', value: 98000 },
    { date: '2023-08', value: 100000 },
    { date: '2023-09', value: 105000 },
    { date: '2023-10', value: 110000 },
    { date: '2023-11', value: 115000 },
    { date: '2023-12', value: 118000 },
    { date: '2024-01', value: 122000 },
    { date: '2024-02', value: 125000 },
  ]
};

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Investment Portfolio</h1>
      
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
    </div>
  );
};

export default Dashboard;