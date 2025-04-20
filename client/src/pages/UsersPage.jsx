import { useEffect, useState } from "react";
import { UserCheck, UsersIcon, UserX, Award, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import AnggotaDonutChart from "../components/users/AnggotaDonutChart";

const UsersPage = () => {
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
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Anggota DIGCITY' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Total Anggota'
            icon={UsersIcon}
            value={loading ? "..." : stats.total_users.toLocaleString()}
            color='#6366F1'
          />
          <StatCard
            name='Anggota Aktif'
            icon={UserCheck}
            value={loading ? "..." : stats.active_users.toLocaleString()}
            color='#10B981'
          />
          <StatCard
            name='Anggota Tidak Aktif'
            icon={UserX}
            value={loading ? "..." : stats.inactive_users.toLocaleString()}
            color='#F59E0B'
          />
          <StatCard
            name='Predikat Baik'
            icon={Award}
            value={loading ? "..." : stats.predikat_baik.toLocaleString()}
            color='#22C55E'
          />
          <StatCard
            name='Predikat Buruk'
            icon={AlertOctagon}
            value={loading ? "..." : stats.predikat_buruk.toLocaleString()}
            color='#EF4444'
          />
        </motion.div>
        <AnggotaDonutChart />
        <UsersTable />
        {/*<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <UserGrowthChart />
          <UserActivityHeatmap />
          <UserDemographicsChart />
        </div>
        <div className="mt-8">
        </div>*/}
      </main>
    </div>
  );
};

export default UsersPage;
