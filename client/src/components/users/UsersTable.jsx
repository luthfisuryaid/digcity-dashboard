import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, RefreshCw, Plus } from "lucide-react";
import axios from "axios";
import DetailAnggotaModal from "./DetailAnggotaModal";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { locationMapping } from "../../utils/locationData";
import Select from "react-select";
import { toast } from 'react-toastify';
import TambahAnggotaModal from "./TambahAnggotaModal";

const UsersTable = () => {
  // State untuk tabel dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);

  // State untuk filter dropdown
  const [filters, setFilters] = useState({
    divisi: "",
    jabatan: "",
    angkatan: "",
    sanksi: "",
  });

  // State untuk toggle panel filter
  const [showFilters, setShowFilters] = useState(false);

  // Mendapatkan nilai unik untuk dropdown filter
  const [uniqueValues, setUniqueValues] = useState({
    divisi: [],
    jabatan: [],
    angkatan: [],
    sanksi: [],
  });

  // Pagination variables
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk me-refresh data dari server
  const refreshData = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const response = await axios.get("http://localhost:5000/anggota");
      
      if (Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
        
        // Ekstrak nilai unik untuk filter dropdown
        const divisions = [...new Set(response.data.map(item => item.divisi).filter(Boolean))];
        const positions = [...new Set(response.data.map(item => item.jabatan).filter(Boolean))];
        const years = [...new Set(response.data.map(item => item.angkatan).filter(Boolean))];
        const sanksi = [...new Set(response.data.map(item => item.sanksi).filter(Boolean))];
        
        setUniqueValues({
          divisi: divisions,
          jabatan: positions,
          angkatan: years,
          sanksi: sanksi,
        });
        
        toast.success(`Data berhasil disegarkan. ${response.data.length} anggota dimuat.`);
      } else {
        setError("Format data tidak valid");
        toast.error("Format data tidak valid");
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(`Gagal menyegarkan data: ${err.message}`);
      toast.error(`Gagal menyegarkan data: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch data saat komponen dimount
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk mengambil data awal
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get("http://localhost:5000/anggota");
      
      if (Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
        
        // Ekstrak nilai unik untuk filter dropdown
        const divisions = [...new Set(response.data.map(item => item.divisi).filter(Boolean))];
        const positions = [...new Set(response.data.map(item => item.jabatan).filter(Boolean))];
        const years = [...new Set(response.data.map(item => item.angkatan).filter(Boolean))];
        const sanksi = [...new Set(response.data.map(item => item.sanksi).filter(Boolean))];
        
        setUniqueValues({
          divisi: divisions,
          jabatan: positions,
          angkatan: years,
          sanksi: sanksi,
        });
        
        console.log(`Berhasil memuat ${response.data.length} data anggota`);
      } else {
        setData([]);
        setFilteredData([]);
        setError("Format data tidak valid");
      }
    } catch (err) {
      setData([]);
      setFilteredData([]);
      setError(`Gagal mengambil data anggota: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk anggota update
  const handleAnggotaUpdate = (updatedAnggota) => {
    // Update data di state
    setData(prevData => prevData.map(item => 
      item.id === updatedAnggota.id ? updatedAnggota : item
    ));
    
    // Update filtered data juga
    setFilteredData(prevData => prevData.map(item => 
      item.id === updatedAnggota.id ? updatedAnggota : item
    ));
    
    toast.success(`Data anggota ${updatedAnggota.nama_anggota} berhasil diperbarui`);
  };

  // Fungsi untuk menambahkan anggota baru
  const handleAnggotaAdded = (newAnggota) => {
    // Refresh data dari server
    refreshData();
    toast.success(`Anggota baru berhasil ditambahkan`);
  };

  // Handler untuk hapus anggota
  const handleDeleteAnggota = async (id, nama) => {
    try {
      await axios.delete(`http://localhost:5000/anggota/${id}`);
      
      // Update data setelah hapus
      setData(prevData => prevData.filter(item => item.id !== id));
      setFilteredData(prevData => prevData.filter(item => item.id !== id));
      
      toast.success(`Anggota ${nama} berhasil dihapus`);
    } catch (err) {
      console.error("Error deleting member:", err);
      toast.error(`Gagal menghapus anggota: ${err.message}`);
    }
  };

  // Apply filters
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
    if (filters.sanksi) {
      result = result.filter(
        (anggota) => anggota.sanksi === filters.sanksi
      );
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  }, [data, searchTerm, filters]);

  // Handler for search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      divisi: "",
      jabatan: "",
      angkatan: "",
      sanksi: "",
    });
    setSearchTerm("");
  };

  // Handler for pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header dan Area Search/Filter/Tambah */}
      <div className="bg-blue-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Anggota DigCity
          </h2>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari anggota..."
                className="w-full md:w-64 bg-blue-800 text-white placeholder-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                showFilters ? "bg-blue-600" : "bg-blue-800"
              } text-white`}
            >
              <Filter size={18} />
              Filter
            </button>

            {/* Tombol Refresh Data */}
            <button
              onClick={refreshData}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors ${isRefreshing ? 'opacity-75' : ''}`}
              disabled={isRefreshing}
            >
              <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Menyegarkan...' : 'Segarkan Data'}
            </button>
            
            {/* Tombol + untuk Tambah Anggota (Tanpa Teks) */}
            <button
              onClick={() => setIsTambahModalOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
              title="Tambah Anggota Baru"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mb-6 p-5 bg-blue-900/60 rounded-lg border border-blue-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-white text-sm mb-1">
                    Divisi
                  </label>
                  <select
                    className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                    value={filters.divisi}
                    onChange={(e) =>
                      handleFilterChange("divisi", e.target.value)
                    }
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
                  <label className="block text-white text-sm mb-1">
                    Jabatan
                  </label>
                  <select
                    className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                    value={filters.jabatan}
                    onChange={(e) =>
                      handleFilterChange("jabatan", e.target.value)
                    }
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
                  <label className="block text-white text-sm mb-1">
                    Angkatan
                  </label>
                  <select
                    className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                    value={filters.angkatan}
                    onChange={(e) =>
                      handleFilterChange("angkatan", e.target.value)
                    }
                  >
                    <option value="">Semua Angkatan</option>
                    {uniqueValues.angkatan.map((angkatan) => (
                      <option key={angkatan} value={angkatan}>
                        {angkatan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm mb-1">
                    Sanksi
                  </label>
                  <select
                    className="w-full bg-blue-800 text-white rounded-lg px-3 py-2 border border-blue-700"
                    value={filters.sanksi}
                    onChange={(e) =>
                      handleFilterChange("sanksi", e.target.value)
                    }
                  >
                    <option value="">Semua Sanksi</option>
                    {uniqueValues.sanksi.map((sanksi) => (
                      <option key={sanksi} value={sanksi}>
                        {sanksi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600"
                >
                  Reset Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tampilkan filter yang aktif */}
        {(filters.divisi || filters.jabatan || filters.angkatan || filters.sanksi) && (
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
            {filters.sanksi && (
              <span className="px-3 py-1 bg-blue-800 text-white text-sm rounded-full flex items-center">
                Sanksi: {filters.sanksi}
                <button
                  className="ml-2 text-xs"
                  onClick={() => handleFilterChange("sanksi", "")}
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto table-scrollbar">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
              Memuat data...
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-700 border-separate border-spacing-y-1">
                <thead className="bg-blue-900/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider rounded-tl-lg">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider rounded-tr-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((anggota, index) => (
                    <motion.tr
                      key={anggota.id}
                      className="bg-blue-900/60 hover:bg-blue-800/80 transition-colors"
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
                            <div className="text-xs font-medium text-gray-100">
                              {anggota.nama_anggota}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-300">
                          {anggota.npm}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap text-gray-300">
                        {anggota.jabatan}{" "}
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                          {anggota.divisi}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap text-gray-300">
                        {anggota.angkatan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-300 space-x-2">
                        <button
                          onClick={() => setSelectedAnggota(anggota)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Lihat Detail
                        </button>
                        <button
                          onClick={() => handleDeleteAnggota(anggota.id, anggota.nama_anggota)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-400 bg-blue-900/40 rounded-lg"
                      >
                        Tidak ada data anggota yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-blue-800 bg-blue-900/40 px-6 py-4 mt-4 rounded-lg">
                <div className="text-white text-sm">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {filteredData.length === 0 ? 0 : indexOfFirstItem + 1}
                  </span>{" "}
                  sampai{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredData.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">{filteredData.length}</span>{" "}
                  anggota
                </div>

                <div className="pagination-scroll flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    // Only show limited page buttons on large datasets
                    if (
                      totalPages <= 7 ||
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 flex items-center justify-center rounded ${
                            currentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-blue-800 text-white hover:bg-blue-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && pageNumber > 1) ||
                      (pageNumber === currentPage + 2 &&
                        pageNumber < totalPages)
                    ) {
                      return (
                        <span
                          key={`ellipsis-${pageNumber}`}
                          className="w-8 h-8 flex items-center justify-center text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedAnggota && (
        <DetailAnggotaModal
          anggota={selectedAnggota}
          onClose={() => setSelectedAnggota(null)}
          onUpdate={handleAnggotaUpdate}
        />
      )}
      
      {/* Modal Tambah Anggota */}
      <TambahAnggotaModal 
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onSuccess={handleAnggotaAdded}
      />
    </div>
  );
};

export default UsersTable;
