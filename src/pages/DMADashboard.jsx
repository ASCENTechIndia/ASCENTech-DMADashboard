import '../styles/dashboard.css'
import { lazy, Suspense } from "react";
import Header from '../components/Header'
import SummaryCards from '../components/SummaryCards'
import DashboardCard from '../components/DashboardCard'
import TodaysCollectionTable from '../components/TodaysCollectionTable'
import PropertySummaryTable from '../components/PropertySummaryTable'
import CollectionPercentTable from '../components/CollectionPercentTable'
import CollectionStatusModeTable from '../components/CollectionStatusModeTable'
const PropertyDistributionChart = lazy(() =>
  import("../components/PropertyDistributionChart")
);
const CollectionStatusDonutChart = lazy(() =>
  import("../components/CollectionStatusDonutChart")
);
const TopPerformingCorporationsChart = lazy(() =>
  import("../components/TopPerformingCorporationsChart")
);
const PaymentModeAnalysisChart = lazy(() =>
  import("../components/PaymentModeAnalysisChart")
);
const CollectionRankingChart = lazy(() =>
  import("../components/CollectionRankingChart")
);
import DashboardFooter from '../components/DashboardFooter'

function DMADashboard() {
  return (
    <div className="dma-dashboard">
      <div className="container-fluid px-0">

        <div className="row g-3">
          <div className="col-12">
            <Header />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12">
            <SummaryCards />
          </div>
        </div>

       <div className="row g-3 mt-2 align-items-stretch">
  <div className="col-lg-4 col-md-4 col-sm-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Today's Collection (Amount in Lakhs)"
      icon="calendar"
      color="blue"
    >
      <TodaysCollectionTable />
    </DashboardCard>
  </div>

  <div className="col-lg-8 col-md-8 col-sm-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Property Summary"
      icon="building"
      color="blue"
      split
    >
      <PropertySummaryTable />
    <Suspense fallback={<div>Loading Chart...</div>}>  <PropertyDistributionChart /></Suspense>
    </DashboardCard>
  </div>
</div>
      <div className="row g-3 mt-2 align-items-stretch">
  <div className="col-lg-6 col-md-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Collection % (Amount in Cr)"
      icon="pie"
      color="blue"
    >
      <CollectionPercentTable />
    </DashboardCard>
  </div>

  <div className="col-lg-6 col-md-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Collection Status Mode Wise"
      icon="status"
      color="blue"
      split
    >
    <Suspense fallback={<div>Loading Chart...</div>}>  <CollectionStatusDonutChart /></Suspense>
      <CollectionStatusModeTable />
    </DashboardCard>
  </div>
</div>
      <div className="row g-3 mt-2 align-items-stretch">
  <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Top Performing Corporations (By Collection %)"
      icon="bars"
      color="green"
    >
    <Suspense fallback={<div>Loading Chart...</div>}> <TopPerformingCorporationsChart /></Suspense>
    </DashboardCard>
  </div>

  <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Payment Mode Analysis (Collection in Cr)"
      icon="donut"
      color="blue"
    >
    <Suspense fallback={<div>Loading Chart...</div>}>   <PaymentModeAnalysisChart /></Suspense>
    </DashboardCard>
  </div>

  <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
    <DashboardCard
      className="h-100 w-100"
      title="Collection Ranking (By Collection in Cr)"
      icon="trophy"
      color="purple"
    >
    <Suspense fallback={<div>Loading Chart...</div>}>  <CollectionRankingChart /></Suspense>
    </DashboardCard>
  </div>
</div>

        <div className="row g-3 mt-2">
          <div className="col-12">
            <DashboardFooter />
          </div>
        </div>

      </div>
    </div>
  );
}

export default DMADashboard;