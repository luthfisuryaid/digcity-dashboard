import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

import axios from "axios";
import { useEffect, useState } from "react";



const OverviewPage = () => {

  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    predikat_baik: 0,
    predikat_buruk: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/anggota/stats")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value="$12,345"
            color="#6366F1"
          />
          <StatCard
            name="Total Anggota Aktif"
            icon={Users}
            value={loading ? "..." : stats.active_users.toLocaleString()}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value="567"
            color="#EC4899"
          />
          <StatCard
            name="Conversion Rate"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        {/* CHART */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
