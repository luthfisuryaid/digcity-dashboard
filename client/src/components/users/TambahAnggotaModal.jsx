import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { locationMapping } from "../../utils/locationData";

const TambahAnggotaModal = ({ isOpen, onClose, onSuccess }) => {
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
    status_keanggotaan: "Aktif",
    sanksi: "Baik",
    tanggal_sanksi: "",
    alasan_sanksi: "",
    tanggal_perbaikan: "",
    tindakan_perbaikan: "",
    status_tindak_lanjut_sanksi: "",
    // Kolom baru untuk kepengurusan
    tanggal_mulai_kepengurusan: ""
  });

  // Data options untuk dropdown statis
  const kategoriKelasOptions = ["Reguler", "Karyawan"];
  const kelasOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const angkatanOptions = ["2022", "2023", "2024", "2025", "2026"];
  const divisiOptions = ["BPH", "POD", "CMI", "ECRAV", "PR"];
  const jabatanOptions = [
    "CEO", "COO", "CAO", "CFO", 
    "Head of Department", 
    "Administrative Officer", 
    "Staff Department"
  ];
  
  // Kota/Kabupaten options
  const kotaKabupatenOptions = Object.keys(locationMapping).sort();

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
      status_tindak_lanjut_sanksi: "",
      tanggal_mulai_kepengurusan: ""
    });
    setFormError("");
  };

  // Fungsi untuk menghitung tanggal selesai kepengurusan (1 tahun setelah tanggal mulai)
  const getTanggalSelesaiKepengurusan = (tanggalMulai) => {
    if (!tanggalMulai) return "";
    try {
      const date = new Date(tanggalMulai);
      date.setFullYear(date.getFullYear() + 1);
      return formatDate(date);
    } catch (e) {
      return "";
    }
  };

  // Format tanggal untuk tampilan
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  // Hitung periode kepengurusan (format: 2024-2025)
  const getPeriodeKepengurusan = (tanggalMulai) => {
    if (!tanggalMulai) return "";
    try {
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalMulai);
      endDate.setFullYear(endDate.getFullYear() + 1);
      return `${startDate.getFullYear()}-${endDate.getFullYear()}`;
    } catch (e) {
      return "";
    }
  };

  // Validasi form
  const validateForm = () => {
    // Validasi field-field yang wajib diisi
    if (!formData.nama_anggota || !formData.npm || !formData.divisi) {
      setFormError("Nama, NPM, dan Divisi wajib diisi");
      toast.error("Nama, NPM, dan Divisi wajib diisi");
      return false;
    }
    
    // Validasi email jika diisi
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Format email tidak valid");
      toast.error("Format email tidak valid");
      return false;
    }
    
    // Validasi nomor telepon jika diisi
    if (formData.nomor_telepon && !/^[0-9+\-\s()]{10,15}$/.test(formData.nomor_telepon)) {
      setFormError("Format nomor telepon tidak valid");
      toast.error("Format nomor telepon tidak valid");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    
    // Validasi form
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Kirim data ke server
      const response = await axios.post("http://localhost:5000/anggota", formData);
      
      // Panggil callback onSuccess jika berhasil
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(response.data);
      }
      
      // Reset form dan tutup
      resetForm();
      onClose();
      
      toast.success("Anggota baru berhasil ditambahkan");
    } catch (err) {
      console.error("Error adding member:", err);
      setFormError(err.response?.data?.message || "Terjadi kesalahan saat menambahkan anggota");
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menambahkan anggota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-blue-950 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-white"
                  >
                    Tambah Anggota Baru
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white rounded-full p-1 bg-blue-800/50 hover:bg-blue-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md flex items-center"
                  >
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    <span>{formError}</span>
                  </motion.div>
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
                    
                    {/* NPM field */}
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
                    
                    {/* Email & Telepon fields */}
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
                    {/* Kategori Kelas, Kelas, Angkatan */}
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
                    
                    {/* Kota/Kabupaten & Provinsi */}
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
                  
                  {/* Bagian Kepengurusan - format baru */}
                  <div className="space-y-3 md:col-span-3 pt-3 mt-2 border-t border-blue-800">
                    <h4 className="text-blue-300 font-medium">Informasi Kepengurusan</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">
                          Tanggal Mulai Kepengurusan
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="tanggal_mulai_kepengurusan"
                            value={formData.tanggal_mulai_kepengurusan}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">
                          Tanggal Selesai Kepengurusan
                        </label>
                        <p className="px-3 py-2 bg-blue-900/30 border border-blue-800 rounded-md text-gray-400 italic">
                          {formData.tanggal_mulai_kepengurusan ? 
                            getTanggalSelesaiKepengurusan(formData.tanggal_mulai_kepengurusan) : 
                            "Otomatis dihitung 1 tahun dari tanggal mulai"}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">
                          Periode Kepengurusan
                        </label>
                        <p className="px-3 py-2 bg-blue-900/30 border border-blue-800 rounded-md text-white">
                          {formData.tanggal_mulai_kepengurusan ? 
                            getPeriodeKepengurusan(formData.tanggal_mulai_kepengurusan) : 
                            "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tombol Submit */}
                  <div className="mt-6 md:col-span-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Plus size={18} className="mr-1" />
                          Simpan Anggota
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TambahAnggotaModal;
