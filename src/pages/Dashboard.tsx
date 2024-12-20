import { MetricsCard } from "@/components/MetricsCard";
import { PortfolioChart } from "@/components/PortfolioChart";
import { InvestmentsList } from "@/components/InvestmentsList";
import { Investment } from "@/types/portfolio";

const MOCK_INVESTMENTS: Investment[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 10,
    purchasePrice: 150.00,
    currentPrice: 175.50,
  },
  {
    id: "2",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 5,
    purchasePrice: 2800.00,
    currentPrice: 2950.00,
  },
  {
    id: "3",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    quantity: 8,
    purchasePrice: 280.00,
    currentPrice: 310.00,
  },
];

const Dashboard = () => {
  // Calculate portfolio metrics
  const totalValue = MOCK_INVESTMENTS.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0
  );
  
  const totalCost = MOCK_INVESTMENTS.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchasePrice,
    0
  );
  
  const totalGain = totalValue - totalCost;
  const gainPercentage = (totalGain / totalCost) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Investment Portfolio</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <MetricsCard
          title="Portfolio Value"
          value={`$${totalValue.toFixed(2)}`}
        />
        <MetricsCard
          title="Total Gain/Loss"
          value={`$${totalGain.toFixed(2)}`}
          trend={totalGain >= 0 ? "up" : "down"}
        />
        <MetricsCard
          title="Return"
          value={`${gainPercentage.toFixed(2)}%`}
          trend={gainPercentage >= 0 ? "up" : "down"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <PortfolioChart investments={MOCK_INVESTMENTS} />
        <div className="card-gradient rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">
            Coming soon: Add investments, Set alerts, and more!
          </p>
        </div>
      </div>

      <InvestmentsList investments={MOCK_INVESTMENTS} />
    </div>
  );
};

export default Dashboard;