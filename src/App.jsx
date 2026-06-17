import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import DashboardCard from "./components/DashboardCard";
import TodaysCollectionTable from "./components/TodaysCollectionTable";
import PropertySummaryTable from "./components/PropertySummaryTable";
import PropertyDistributionChart from "./components/PropertyDistributionChart";
import CollectionPercentTable from "./components/CollectionPercentTable";
import CollectionStatusDonutChart from "./components/CollectionStatusDonutChart";
import CollectionStatusModeTable from "./components/CollectionStatusModeTable";
import TopPerformingCorporationsChart from "./components/TopPerformingCorporationsChart";
import PaymentModeAnalysisChart from "./components/PaymentModeAnalysisChart";
import CollectionRankingChart from "./components/CollectionRankingChart";
import DashboardFooter from "./components/DashboardFooter";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="dma-dashboard">
      <div className="container-fluid px-0">
        <div className="row g-3">
          <div className="col-12">
            <Header />
          </div>
        </div>

        <div className="row g-3" >
          <div className="col-12">
            <SummaryCards />
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-lg-4 col-md-4 col-sm-12 m-0">
            <DashboardCard
              title="Today's Collection (Amount in Lakhs)"
              icon="calendar"
              color="blue"
            >
              <TodaysCollectionTable />
            </DashboardCard>
          </div>
          <div className="col-lg-8 col-md-8 col-sm-12 m-0 mt-lg-0 mt-2">
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
        </div>

        <div className="row g-3 mt-2">
          <div className="col-lg-6 col-md-12 m-0">
            <DashboardCard
              title="Collection % (Amount in Cr)"
              icon="pie"
              color="blue"
            >
              <CollectionPercentTable />
            </DashboardCard>
          </div>
          <div className="col-lg-6 col-md-12 m-0 mt-lg-0 mt-2">
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
        </div>

        {/* Row: three equal columns for the last three charts */}
        <div className="row g-3 mt-2">
          <div className="col-lg-4 col-md-6 col-sm-12 m-0">
            <DashboardCard
              title="Top Performing Corporations (By Collection %)"
              icon="bars"
              color="green"
            >
              <TopPerformingCorporationsChart />
            </DashboardCard>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 m-0 mt-lg-0 mt-2">
            <DashboardCard
              title="Payment Mode Analysis (Collection in Cr)"
              icon="donut"
              color="blue"
            >
              <PaymentModeAnalysisChart />
            </DashboardCard>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 m-0 mt-lg-0 mt-2">
            <DashboardCard
              title="Collection Ranking (By Collection in Cr)"
              icon="trophy"
              color="purple"
            >
              <CollectionRankingChart />
            </DashboardCard>
          </div>
        </div>

        {/* Footer – full width */}
        <div className="row g-3 mt-2">
          <div className="col-12 m-0">
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
