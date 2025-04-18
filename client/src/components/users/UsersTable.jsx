import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import axios from "axios";
import DetailAnggotaModal from "./DetailUsersModal";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const dummyData = [
  {
    id: 1,
    nama_anggota: "John Doe",
    npm: "12345",
    divisi: "Frontend",
    jabatan: "Ketua",
    angkatan: "2022",
  },
  {
    id: 2,
    nama_anggota: "Jane Smith",
    npm: "67890",
    divisi: "Backend",
    jabatan: "Anggota",
    angkatan: "2023",
  },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State untuk filter dropdown
  const [filters, setFilters] = useState({
    divisi: "",
    jabatan: "",
    angkatan: "",
  });

  // State untuk toggle panel filter
  const [showFilters, setShowFilters] = useState(false);

  // Mendapatkan nilai unik untuk dropdown filter
  const [uniqueValues, setUniqueValues] = useState({
    divisi: [],
    jabatan: [],
    angkatan: [],
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setData(dummyData);
      setFilteredData(dummyData);
      setError("Tidak dapat terhubung ke server. Menggunakan data contoh.");
      setLoading(false);
    }, 5000);

    axios
      .get("/anggota")
      .then((res) => {
        clearTimeout(timeoutId);
        if (Array.isArray(res.data)) {
          setData(res.data);
          setFilteredData(res.data);
        } else if (res.data && typeof res.data === "object") {
          const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
          setData(dataArray);
          setFilteredData(dataArray);
          if (dataArray.length === 0)
            setError("Format data tidak sesuai dengan yang diharapkan");
        } else {
          setData([]);
          setFilteredData([]);
          setError("Format data tidak valid");
        }
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        setData(dummyData);
        setFilteredData(dummyData);
        setError(`Error: ${err.message}. Menggunakan data contoh.`);
        setLoading(false);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (Array.isArray(data)) {
      const filtered = data.filter(
        (anggota) =>
          anggota.nama_anggota?.toLowerCase().includes(term) ||
          anggota.npm?.toLowerCase().includes(term) ||
          anggota.divisi?.toLowerCase().includes(term) ||
          anggota.jabatan?.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset ke halaman 1 saat search
    }
  };

  useEffect(() => {
    // Extract unique values for dropdowns when data is loaded
    if (data.length > 0) {
      const divisions = [
        ...new Set(data.map((item) => item.divisi).filter(Boolean)),
      ];
      const positions = [
        ...new Set(data.map((item) => item.jabatan).filter(Boolean)),
      ];
      const years = [
        ...new Set(data.map((item) => item.angkatan).filter(Boolean)),
      ];

      setUniqueValues({
        divisi: divisions,
        jabatan: positions,
        angkatan: years,
      });
    }
  }, [data]);

  // Gabungkan filter text search dan dropdown
  useEffect(() => {
    let result = [...data];

    // Apply text search filter
    if (searchTerm) {
      result = result.filter(
        (anggota) =>
          anggota.nama_anggota
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          anggota.npm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          anggota.divisi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          anggota.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply dropdown filters
    if (filters.divisi) {
      result = result.filter((anggota) => anggota.divisi === filters.divisi);
    }

    if (filters.jabatan) {
      result = result.filter((anggota) => anggota.jabatan === filters.jabatan);
    }

    if (filters.angkatan) {
      result = result.filter(
        (anggota) => anggota.angkatan === filters.angkatan
      );
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  }, [searchTerm, filters, data]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      divisi: "",
      jabatan: "",
      angkatan: "",
    });
    setSearchTerm("");
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      className="bg-blue-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Tabel Anggota</h2>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari anggota..."
              className="bg-blue-800 text-white placeholder-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-200"
              size={18}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              showFilters ? "bg-blue-600 " : "bg-blue-800"
            } text-white`}
          >
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>


      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          className="mb-6 p-4 bg-blue-900 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-white text-sm mb-1">Divisi</label>
              <select
                className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                value={filters.divisi}
                onChange={(e) => handleFilterChange("divisi", e.target.value)}
              >
                <option value="">Semua Divisi</option>
                {uniqueValues.divisi.map((divisi) => (
                  <option key={divisi} value={divisi}>
                    {divisi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Jabatan</label>
              <select
                className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                value={filters.jabatan}
                onChange={(e) => handleFilterChange("jabatan", e.target.value)}
              >
                <option value="">Semua Jabatan</option>
                {uniqueValues.jabatan.map((jabatan) => (
                  <option key={jabatan} value={jabatan}>
                    {jabatan}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Angkatan</label>
              <select
                className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                value={filters.angkatan}
                onChange={(e) => handleFilterChange("angkatan", e.target.value)}
              >
                <option value="">Semua Angkatan</option>
                {uniqueValues.angkatan.map((angkatan) => (
                  <option key={angkatan} value={angkatan}>
                    {angkatan}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-gray-600"
            >
              Reset Filter
            </button>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tampilkan filter yang aktif */}
      {(filters.divisi || filters.jabatan || filters.angkatan) && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-sm text-white">Filter Aktif:</span>
          {filters.divisi && (
            <span className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full flex items-center">
              Divisi: {filters.divisi}
              <button
                className="ml-2 text-xs"
                onClick={() => handleFilterChange("divisi", "")}
              >
                ✕
              </button>
            </span>
          )}
          {filters.jabatan && (
            <span className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full flex items-center">
              Jabatan: {filters.jabatan}
              <button
                className="ml-2 text-xs"
                onClick={() => handleFilterChange("jabatan", "")}
              >
                ✕
              </button>
            </span>
          )}
          {filters.angkatan && (
            <span className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full flex items-center">
              Angkatan: {filters.angkatan}
              <button
                className="ml-2 text-xs"
                onClick={() => handleFilterChange("angkatan", "")}
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}

      <div className="overflow-x-auto table-scrollbar">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Memuat data...
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    NPM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Angkatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentItems.map((anggota, index) => (
                  <motion.tr
                    key={anggota.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {anggota.nama_anggota?.charAt(0) || "?"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {anggota.nama_anggota}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{anggota.npm}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-300">
                      {anggota.jabatan}{" "}
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                        {anggota.divisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {anggota.angkatan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 space-x-2">
                      <button
                        onClick={() => setSelectedAnggota(anggota)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Lihat Detail
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400">
                      Tidak ada data anggota yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination yang sudah diperbaiki */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-blue-950/80 px-4 py-3 sm:px-6 rounded-b-xl">
              <div className="text-white text-sm">
                Menampilkan{" "}
                <span>
                  {filteredData.length === 0 ? 0 : indexOfFirstItem + 1}
                </span>{" "}
                sampai{" "}
                <span>{Math.min(indexOfLastItem, filteredData.length)}</span>{" "}
                dari <span>{filteredData.length}</span> anggota
              </div>

              <div
                className="pagination-scroll flex gap-1"
                style={{ maxWidth: 600 }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-blue-900 text-white rounded"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-blue-900 text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 bg-blue-900 text-white rounded"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Detail Anggota */}
      {selectedAnggota && (
        <DetailAnggotaModal
          anggota={selectedAnggota}
          onClose={() => setSelectedAnggota(null)}
        />
      )}
    </motion.div>
  );
};

export default UsersTable;
