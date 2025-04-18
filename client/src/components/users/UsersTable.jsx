import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from 'axios';
import DetailAnggotaModal from "./DetailUsersModal";

const dummyData = [
  { id: 1, nama: "John Doe", npm: "12345", divisi: "Frontend", jabatan: "Ketua", angkatan: "2022" },
  { id: 2, nama: "Jane Smith", npm: "67890", divisi: "Backend", jabatan: "Anggota", angkatan: "2023" },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnggota, setSelectedAnggota] = useState(null); // State untuk menyimpan data anggota yang dipilih
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const timeoutId = setTimeout(() => {
      console.log("Server connection timeout, using dummy data");
      setData(dummyData);
      setFilteredData(dummyData);
      setError("Tidak dapat terhubung ke server. Menggunakan data contoh.");
      setLoading(false);
    }, 5000);
    
    axios.get('/anggota')
      .then((res) => {
        clearTimeout(timeoutId);
        console.log("API Response:", res.data);
        
        if (Array.isArray(res.data)) {
          setData(res.data);
          setFilteredData(res.data);
        } else if (res.data && typeof res.data === 'object') {
          // Jika response adalah objek, cek apakah ada properti data
          const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
          setData(dataArray);
          setFilteredData(dataArray);
          
          if (dataArray.length === 0) {
            setError("Format data tidak sesuai dengan yang diharapkan");
          }
        } else {
          setData([]);
          setFilteredData([]);
          setError("Format data tidak valid");
        }
        
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error("Error fetching data:", err);
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
      const filtered = data.filter((anggota) => 
        anggota.nama_anggota?.toLowerCase().includes(term) || 
        anggota.npm?.toLowerCase().includes(term) || 
        anggota.divisi?.toLowerCase().includes(term) ||
        anggota.jabatan?.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <motion.div
      className='bg-blue-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Anggota DigCity</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Cari anggota...'
            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className='overflow-x-auto'>
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Memuat data...
          </div>
        ) : (
          <>
          <table className='min-w-full divide-y divide-gray-700'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  No
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Nama
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  NPM
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Divisi
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Angkatan
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-700'>
            {currentItems.map((anggota, index) => (
                <motion.tr
                  key={anggota.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-gray-300'>{anggota.id}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                          {anggota.nama_anggota?.charAt(0) || '?'}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-100'>{anggota.nama_anggota}</div>
                      </div>
                    </div>
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-300'>{anggota.npm}</div>
                  </td>
                  
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
                      {anggota.divisi}
                    </span>
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap text-gray-300'>
                    {anggota.angkatan}
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 space-x-2'>
                    <button 
                      onClick={() => setSelectedAnggota(anggota)}
                      className='text-indigo-400 hover:text-indigo-300'
                    >
                      Lihat Detail
                    </button>
                    <button className='text-red-400 hover:text-red-300'>Delete</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} anggota
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Next
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