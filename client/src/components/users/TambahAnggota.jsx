import { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { locationMapping } from "../../utils/locationData";

const TambahAnggotaButton = ({ onSuccess }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  
  // State untuk form data dengan default values
  const [formData, setFormData] = useState({
    nama_anggota: "",
    npm: "",
    kategori_kelas: "",
    kelas: "",
    angkatan: "",
    divisi: "",
    jabatan: "",
    jenis_kelamin: "",
    kota_kabupaten: "",
    provinsi: "",
    email: "",
    nomor_telepon: "",
    status_keanggotaan: "Aktif", // Default: Aktif
    sanksi: "Baik", // Default: Baik
    tanggal_sanksi: "",
    alasan_sanksi: "",
    tanggal_perbaikan: "",
    tindakan_perbaikan: "",
    status_tindak_lanjut_sanksi: ""
  });

  // Data options untuk dropdown statis
  const kategoriKelasOptions = ["Reguler", "Karyawan"];
  const kelasOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const angkatanOptions = ["2022", "2023", "2024", "2025", "2026"];
  const divisiOptions = ["BPH", "POD", "CMI", "ECRAV", "PR"];
  const jabatanOptions = [
    "CEO", "COO", "CAO", "CFO", 
    "Head of Departement", 
    "Administrative Officer", 
    "Staff Departement"
  ];
  
  // Kota/Kabupaten options
  const kotaKabupatenOptions = Object.keys(locationMapping).sort();

  // Toggle form visibility
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (isFormOpen) {
      resetForm();
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "kota_kabupaten") {
      // Jika kota/kabupaten dipilih, isi provinsi secara otomatis
      setFormData(prev => ({
        ...prev,
        [name]: value,
        provinsi: locationMapping[value] || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nama_anggota: "",
      npm: "",
      kategori_kelas: "",
      kelas: "",
      angkatan: "",
      divisi: "",
      jabatan: "",
      jenis_kelamin: "",
      kota_kabupaten: "",
      provinsi: "",
      email: "",
      nomor_telepon: "",
      status_keanggotaan: "Aktif",
      sanksi: "Baik",
      tanggal_sanksi: "",
      alasan_sanksi: "",
      tanggal_perbaikan: "",
      tindakan_perbaikan: "",
      status_tindak_lanjut_sanksi: ""
    });
    setFormError("");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    // Validasi form sederhana
    if (!formData.nama_anggota || !formData.npm || !formData.divisi) {
      setFormError("Nama, NPM, dan Divisi wajib diisi");
      setIsLoading(false);
      return;
    }

    try {
      // Kirim data ke server
      const response = await axios.post('/anggota', formData);
      
      // Panggil callback onSuccess jika berhasil
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response.data);
      }
      
      // Reset form dan tutup
      resetForm();
      setIsFormOpen(false);
      
    } catch (err) {
      console.error("Error adding member:", err);
      setFormError(err.response?.data?.message || "Terjadi kesalahan saat menambahkan anggota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={toggleForm}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <UserPlus size={18} />
        {isFormOpen ? "Tutup Form" : "Tambah Anggota"}
      </button>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-blue-900/40 backdrop-blur-sm rounded-lg border border-blue-800"
          >
            <h3 className="text-xl font-medium text-white mb-4">Tambah Anggota Baru</h3>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kolom 1: Informasi Pribadi */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Nama Anggota <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_anggota"
                    value={formData.nama_anggota}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    NPM <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="npm"
                    value={formData.npm}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                {/* Jenis Kelamin dengan Warna Khusus */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${formData.jenis_kelamin === "Laki-Laki" ? "bg-blue-800 text-white border-blue-700" : 
                        formData.jenis_kelamin === "Perempuan" ? "bg-pink-800 text-white border-pink-700" : 
                        "bg-blue-950 text-white border-blue-800"}`}
                  >
                    <option value="" className="bg-blue-950">Pilih Jenis Kelamin</option>
                    <option value="Laki-Laki" className="bg-blue-800">Laki-Laki</option>
                    <option value="Perempuan" className="bg-pink-800">Perempuan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    name="nomor_telepon"
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Kolom 2: Informasi Akademik dan Lokasi */}
              <div className="space-y-3">
                {/* Kategori Kelas */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Kategori Kelas
                  </label>
                  <select
                    name="kategori_kelas"
                    value={formData.kategori_kelas}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kategori Kelas</option>
                    {kategoriKelasOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Kelas */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Kelas
                  </label>
                  <select
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Angkatan */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Angkatan
                  </label>
                  <select
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Angkatan</option>
                    {angkatanOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Kota/Kabupaten */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Kota/Kabupaten
                  </label>
                  <select
                    name="kota_kabupaten"
                    value={formData.kota_kabupaten}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {kotaKabupatenOptions.map((kota) => (
                      <option key={kota} value={kota}>
                        {kota}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Provinsi (Auto-filled) */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="provinsi"
                    value={formData.provinsi}
                    readOnly
                    className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-md text-white focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              
              {/* Kolom 3: Informasi Keanggotaan dan Sanksi */}
              <div className="space-y-3">
                {/* Divisi */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Divisi <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    {divisiOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Jabatan */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Jabatan
                  </label>
                  <select
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Jabatan</option>
                    {jabatanOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Status Keanggotaan dengan Warna Khusus */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Status Keanggotaan
                  </label>
                  <select
                    name="status_keanggotaan"
                    value={formData.status_keanggotaan}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${formData.status_keanggotaan === "Aktif" ? "bg-green-800 text-white border-green-700" : 
                        formData.status_keanggotaan === "Tidak Aktif" ? "bg-red-800 text-white border-red-700" : 
                        "bg-blue-950 text-white border-blue-800"}`}
                  >
                    <option value="Aktif" className="bg-green-800">Aktif</option>
                    <option value="Tidak Aktif" className="bg-red-800">Tidak Aktif</option>
                  </select>
                </div>
                
                {/* Sanksi (Default: Baik) */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Sanksi
                  </label>
                  <select
                    name="sanksi"
                    value={formData.sanksi}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Peringatan">Peringatan</option>
                    <option value="Skors">Skors</option>
                  </select>
                </div>
                
                {/* Status Tindak Lanjut Sanksi */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Status Tindak Lanjut Sanksi
                  </label>
                  <select
                    name="status_tindak_lanjut_sanksi"
                    value={formData.status_tindak_lanjut_sanksi}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Status</option>
                    <option value="Belum Ditindaklanjuti">Belum Ditindaklanjuti</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
              
              {/* Tombol Submit */}
              <div className="mt-4 md:col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Menyimpan..." : "Simpan Anggota"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TambahAnggotaButton;