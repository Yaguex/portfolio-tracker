import React, { useEffect, useState } from 'react';
import { MetricsCard } from "@/components/MetricsCard";
import { PortfolioHistoryTable } from "@/components/PortfolioHistoryTable";
import { PortfolioValueChart } from "@/components/PortfolioValueChart";
import { supabase } from "../supabaseClient";

interface MonthlyData {
  id: number;
  month: string; // YYYY-MM-DD format
  balance: number;
  flows: number;
  mom_gain: number;
  mom_return: number;
  ytd_gain: number;
  ytd_return: number;
}

const Dashboard = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [portfolios, setPortfolios] = useState<{ id: string; name: string }[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfoliosAndData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the authenticated user's session
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // Fetch portfolios linked to the user
        const { data: portfolios, error: portfolioError } = await supabase
          .from("portfolios")
          .select("id, name")
          .eq("user_id", userId);

        console.log("Fetched portfolios:", portfolios); // Log portfolios fetched

        if (portfolioError) {
          throw new Error(portfolioError.message);
        }

        setPortfolios(portfolios || []);
        if (portfolios?.length && !selectedPortfolioId) {
          setSelectedPortfolioId(portfolios[0].id); // Select the first portfolio by default
        }

        // Fetch monthly data for the selected portfolio
        if (selectedPortfolioId) {
          const { data: monthlyData, error: dataError } = await supabase
            .from("monthly_portfolio_data")
            .select("*")
            .eq("portfolio_id", selectedPortfolioId)
            .order("month", { ascending: true });

          console.log("Fetched monthly data:", monthlyData); // Log monthly data fetched

          if (dataError) {
            throw new Error(dataError.message);
          }

          setMonthlyData(monthlyData || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err.message); // Log error messages
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfoliosAndData();
  }, [selectedPortfolioId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  // Get the latest month's data (last entry in monthlyData)
  const latestMonthData = monthlyData[monthlyData.length - 1];

  // Calculate YTD values for the latest month
  const startOfYearData = monthlyData.find(
    (entry) => entry.month.startsWith(`${new Date().getFullYear()}-01`)
  );

  const ytdGain = latestMonthData
    ? latestMonthData.ytd_gain
    : startOfYearData
    ? latestMonthData.balance - startOfYearData.balance
    : 0;

  const ytdReturn = latestMonthData ? latestMonthData.ytd_return : 0;

  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Portfolio Selector */}
      <div className="mb-4">
        <label htmlFor="portfolio-select" className="block text-sm font-medium text-gray-700">
          Select Portfolio
        </label>
        <select
          id="portfolio-select"
          value={selectedPortfolioId || ""}
          onChange={(e) => setSelectedPortfolioId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {portfolios.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <MetricsCard
          title="Portfolio Value"
          value={`$${latestMonthData?.balance.toLocaleString() || "0"}`}
        />
        <MetricsCard
          title="YTD Gain"
          value={`$${ytdGain.toLocaleString() || "0"}`}
          trend={ytdGain >= 0 ? "up" : "down"}
          valueColor={ytdGain >= 0 ? "text-green-600" : "text-red-600"}
        />
        <MetricsCard
          title="YTD Return"
          value={`${ytdReturn >= 0 ? "+" : ""}${ytdReturn.toFixed(2)}%`}
          trend={ytdReturn >= 0 ? "up" : "down"}
          valueColor={ytdReturn >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>

      <div className="mb-8">
        <PortfolioValueChart
          data={monthlyData.map((entry) => ({
            date: entry.month,
            value: entry.balance,
          }))}
        />
      </div>

      <div className="mb-8">
        <PortfolioHistoryTable data={monthlyData} />
      </div>
    </div>
  );
};

export default Dashboard;