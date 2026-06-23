import "../styles/dashboard.css";

import Navbar from "../components/navbar";

import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import DashboardCard from "../components/DashboardCard";
import TodaysCollectionTable from "../components/TodaysCollectionTable";
import PropertySummaryTable from "../components/PropertySummaryTable";
import PropertyDistributionChart from "../components/PropertyDistributionChart";
import CollectionPercentTable from "../components/CollectionPercentTable";
import CollectionStatusDonutChart from "../components/CollectionStatusDonutChart";
import CollectionStatusModeTable from "../components/CollectionStatusModeTable";
import TopPerformingCorporationsChart from "../components/TopPerformingCorporationsChart";
import PaymentModeAnalysisChart from "../components/PaymentModeAnalysisChart";
import CollectionRankingChart from "../components/CollectionRankingChart";
import DashboardFooter from "../components/DashboardFooter";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="dma-dashboard">
        <div className="dma-grid">

          <Header />

          <SummaryCards />

          <div className="dma-row dma-row-1-2">
            <DashboardCard
              title="Today's Collection (Amount in Lakhs)"
              icon="calendar"
              color="blue"
            >
              <TodaysCollectionTable />
            </DashboardCard>

            <DashboardCard
              title="Property Summary"
              icon="building"
              color="blue"
              split
            >
              <PropertySummaryTable />
              <PropertyDistributionChart />
            </DashboardCard>
          </div>

          <div className="dma-row dma-row-14-1">
            <DashboardCard
              title="Collection % (Amount in Cr)"
              icon="pie"
              color="blue"
            >
              <CollectionPercentTable />
            </DashboardCard>

            <DashboardCard
              title="Collection Status Mode Wise"
              icon="status"
              color="blue"
              split
            >
              <CollectionStatusDonutChart />
              <CollectionStatusModeTable />
            </DashboardCard>
          </div>

          <div className="dma-row dma-row-3">
            <DashboardCard
              title="Top Performing Corporations (By Collection %)"
              icon="bars"
              color="green"
            >
              <TopPerformingCorporationsChart />
            </DashboardCard>

            <DashboardCard
              title="Payment Mode Analysis (Collection in Cr)"
              icon="donut"
              color="blue"
            >
              <PaymentModeAnalysisChart />
            </DashboardCard>

            <DashboardCard
              title="Collection Ranking (By Collection in Cr)"
              icon="trophy"
              color="purple"
            >
              <CollectionRankingChart />
            </DashboardCard>
          </div>

          <DashboardFooter />

        </div>
      </div>
    </>
  );
}