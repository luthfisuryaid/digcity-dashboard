import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FFBB28",
];

const AnggotaDonutChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anggotaData, setAnggotaData] = useState([]);
  const [totalAnggota, setTotalAnggota] = useState(0);

  useEffect(() => {
    // Fungsi untuk mengambil data dari database
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/anggota");

        // Filter dan hitung jumlah anggota per divisi, kecuali BPH
        // Dan hanya untuk anggota dengan status_keanggotaan "Aktif"
        const divisiCount = response.data.reduce((acc, anggota) => {
          // Skip BPH dan hanya perhitungkan anggota dengan status Aktif
          if (anggota.divisi !== "BPH" && anggota.status_keanggotaan === "Aktif") {
            acc[anggota.divisi] = (acc[anggota.divisi] || 0) + 1;
          }
          return acc;
        }, {});

        // Format data untuk donut chart
        const chartData = Object.keys(divisiCount).map((divisi) => ({
          name: divisi,
          value: divisiCount[divisi],
        }));

        // Hitung total anggota (tidak termasuk BPH dan hanya yang aktif)
        const total = chartData.reduce((sum, item) => sum + item.value, 0);

        setAnggotaData(chartData);
        setTotalAnggota(total);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data anggota");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <motion.div
        className="bg-blue-950 bg-opacity-50 mb-8 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700 lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Distribusi Anggota Aktif per Divisi
        </h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <motion.div
        className="bg-blue-950 bg-opacity-50 mb-8 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700 lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Distribusi Anggota Aktif per Divisi
        </h2>
        <div className="flex items-center justify-center h-[300px] text-red-500">
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  // Jika tidak ada data
  if (anggotaData.length === 0) {
    return (
      <motion.div
        className="bg-blue-950 bg-opacity-50 mb-8 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700 lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Distribusi Anggota Aktif per Divisi
        </h2>
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          <p>Tidak ada data anggota aktif untuk ditampilkan</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-blue-950 bg-opacity-50 mb-8 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700 lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">
          Distribusi Anggota Aktif per Divisi
        </h2>
        <div className="bg-blue-900/50 px-3 py-1 rounded-full text-sm text-blue-200">
          Total: {totalAnggota} Anggota Aktif
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={anggotaData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              paddingAngle={2}
            >
              {anggotaData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value, name) => [
                `${value} Anggota Aktif (${((value / totalAnggota) * 100).toFixed(
                  1
                )}%)`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnggotaDonutChart;
