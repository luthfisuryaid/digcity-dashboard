import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Save, X, Edit2, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from 'react-toastify';

// CSS untuk scrollbar modern
const scrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-track {
    background: #192655;
    border-radius: 8px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #6366f1, #818cf8);
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #4f46e5, #818cf8);
  }
  
  .modern-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #6366f1 #192655;
  }
`;

const DetailAnggotaModal = ({ anggota, onClose, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...anggota });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Data options untuk dropdown
  const kategoriKelasOptions = ["Reguler", "Karyawan"];
  const kelasOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const angkatanOptions = ["2022", "2023", "2024", "2025", "2026"];
  const divisiOptions = ["BPH", "POD", "CMI", "ECRAV", "PR"];
  const jabatanOptions = [
    "Staff Departement",
    "Head of Departement",
    "Administrative Officer",
    "CEO",
    "COO",
    "CAO",
    "CFO",
  ];
  const statusOptions = ["Aktif", "Tidak Aktif"];
  const sanksiOptions = ["Baik", "Dalam Pantauan", "SP 1", "SP 2", "SP 3", "Dikeluarkan"];
  const statusTindakLanjutOptions = [
    "Belum Ditindaklanjuti",
    "Dalam Proses",
    "Selesai",
  ];

  // Inisialisasi form data dari props anggota
  useEffect(() => {
    if (anggota) {
      setFormData({ 
        ...anggota,
        // Pastikan kolom baru ada
        tanggal_mulai_kepengurusan: anggota.tanggal_mulai_kepengurusan || ""
      });
    }
  }, [anggota]);

  // Format tanggal jika ada
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format tanggal untuk input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    } catch (e) {
      return "";
    }
  };

  // Fungsi untuk menghitung tanggal selesai kepengurusan (1 tahun setelah tanggal mulai)
  const getTanggalSelesaiKepengurusan = (tanggalMulai) => {
    if (!tanggalMulai) return "-";
    try {
      const date = new Date(tanggalMulai);
      date.setFullYear(date.getFullYear() + 1);
      return formatDate(date);
    } catch (e) {
      return "-";
    }
  };

  // Hitung periode kepengurusan dari tanggal mulai (format: 2024-2025)
  const getPeriodeKepengurusan = (tanggalMulai) => {
    if (!tanggalMulai) return "-";
    try {
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalMulai);
      endDate.setFullYear(endDate.getFullYear() + 1);
      return `${startDate.getFullYear()}-${endDate.getFullYear()}`;
    } catch (e) {
      return "-";
    }
  };

  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validasi form
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.nama_anggota) errors.nama_anggota = "Nama anggota wajib diisi";
    if (!formData.npm) errors.npm = "NPM wajib diisi";
    if (!formData.divisi) errors.divisi = "Divisi wajib diisi";
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }
    
    // Phone number validation
    if (formData.nomor_telepon && !/^[0-9+\-\s()]{10,15}$/.test(formData.nomor_telepon)) {
      errors.nomor_telepon = "Format nomor telepon tidak valid";
    }
    
    // Validasi tanggal mulai kepengurusan jika ada
    if (formData.tanggal_mulai_kepengurusan) {
      const tanggalMulai = new Date(formData.tanggal_mulai_kepengurusan);
      if (isNaN(tanggalMulai.getTime())) {
        errors.tanggal_mulai_kepengurusan = "Format tanggal tidak valid";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Toggle mode edit
  const toggleEditMode = () => {
    if (isEditMode) {
      // Reset form data jika cancel edit
      setFormData({ ...anggota });
      setValidationErrors({});
    }
    setIsEditMode(!isEditMode);
    setError("");
  };

  // Handle submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    
    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Kirim data ke server
      const response = await axios.put(`http://localhost:5000/anggota/${anggota.id}`, formData);
      
      // Sukses
      toast.success("Data anggota berhasil diperbarui");
      setIsEditMode(false);
      
      // Panggil callback onUpdate jika ada
      if (onUpdate && typeof onUpdate === "function") {
        onUpdate(response.data);
      }
      
      // Tutup modal
      onClose();
      
    } catch (err) {
      console.error("Error updating member:", err);
      setError(err.response?.data?.message || "Gagal menyimpan perubahan");
      toast.error(err.response?.data?.message || "Gagal menyimpan perubahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field dengan label
  const renderField = (label, fieldName, isRequired = false) => {
    const hasError = validationErrors[fieldName];
    
    return (
      <div>
        <label className={`block text-sm font-medium ${hasError ? 'text-red-300' : 'text-blue-300'} mb-1`}>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
        {isEditMode ? (
          <div>
            <input
              type="text"
              name={fieldName}
              className={`mt-1 w-full px-3 py-2 ${hasError ? 'bg-red-900/30 border-red-700' : 'bg-blue-950 border-blue-800'} border rounded-md text-white focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              value={formData[fieldName] || ""}
              onChange={handleChange}
            />
            {hasError && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" /> {validationErrors[fieldName]}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1 text-white">
            {anggota[fieldName] || "-"}
          </p>
        )}
      </div>
    );
  };
  
  // Render select field dengan label
  const renderSelectField = (label, fieldName, options, isRequired = false) => {
    const hasError = validationErrors[fieldName];
    
    return (
      <div>
        <label className={`block text-sm font-medium ${hasError ? 'text-red-300' : 'text-blue-300'} mb-1`}>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
        {isEditMode ? (
          <div>
            <select
              name={fieldName}
              className={`mt-1 w-full px-3 py-2 ${hasError ? 'bg-red-900/30 border-red-700' : 'bg-blue-950 border-blue-800'} border rounded-md text-white focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              value={formData[fieldName] || ""}
              onChange={handleChange}
            >
              <option value="">Pilih {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" /> {validationErrors[fieldName]}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1 text-white">
            {anggota[fieldName] || "-"}
          </p>
        )}
      </div>
    );
  };
  
  // Render date field dengan label
  const renderDateField = (label, fieldName, isRequired = false) => {
    const hasError = validationErrors[fieldName];
    
    return (
      <div>
        <label className={`block text-sm font-medium ${hasError ? 'text-red-300' : 'text-blue-300'} mb-1`}>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
        {isEditMode ? (
          <div>
            <input
              type="date"
              name={fieldName}
              className={`mt-1 w-full px-3 py-2 ${hasError ? 'bg-red-900/30 border-red-700' : 'bg-blue-950 border-blue-800'} border rounded-md text-white focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              value={formatDateForInput(formData[fieldName])}
              onChange={handleChange}
            />
            {hasError && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" /> {validationErrors[fieldName]}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1 text-white">
            {formatDate(anggota[fieldName])}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Style tag untuk scrollbar */}
      <style>{scrollbarStyles}</style>

      <Transition appear show={!!anggota} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={isEditMode ? () => {} : onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-blue-950 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center border-b border-blue-800 pb-3 mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6 text-gray-100"
                    >
                      {isEditMode ? "Edit Anggota" : "Detail Anggota"}
                    </Dialog.Title>

                    <div className="flex gap-2">
                      {isEditMode ? (
                        <>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                            onClick={toggleEditMode}
                            disabled={isSubmitting}
                          >
                            <ArrowLeft size={16} />
                            Batal
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            ) : (
                              <Save size={16} />
                            )}
                            Simpan
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={toggleEditMode}
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                            onClick={onClose}
                          >
                            <X size={16} />
                            Tutup
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      {error}
                    </div>
                  )}

                  {/* Tampilkan jumlah validasi error jika ada */}
                  {isEditMode && Object.keys(validationErrors).length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-900/40 border border-yellow-800 text-yellow-200 rounded-md flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Terdapat {Object.keys(validationErrors).length} kesalahan pada form. Silakan perbaiki.
                    </div>
                  )}

                  {/* Tambahkan class modern-scrollbar ke elemen scrollable */}
                  <div className="overflow-y-auto max-h-[70vh] modern-scrollbar pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                      {/* Data Identitas Pribadi */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">1</span>
                          Data Pribadi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {renderField("Nama Anggota", "nama_anggota", true)}
                          {renderField("NPM", "npm", true)}
                          {renderSelectField("Jenis Kelamin", "jenis_kelamin", ["Laki-Laki", "Perempuan"])}
                          {renderField("Email", "email")}
                          {renderField("Nomor Telepon", "nomor_telepon")}
                          
                          {!isEditMode && formData.nomor_telepon && (
                            <div>
                              <label className="block text-sm font-medium text-blue-300">
                                WhatsApp
                              </label>
                              <p className="mt-1">
                                <a
                                  href={`https://wa.me/${formData.nomor_telepon.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                  Chat WhatsApp
                                </a>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Data Akademik */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">2</span>
                          Data Akademik
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {renderSelectField("Kategori Kelas", "kategori_kelas", kategoriKelasOptions)}
                          {renderSelectField("Kelas", "kelas", kelasOptions)}
                          {renderSelectField("Angkatan", "angkatan", angkatanOptions)}
                        </div>
                      </div>

                      {/* Data Keanggotaan */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">3</span>
                          Keanggotaan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {renderSelectField("Divisi", "divisi", divisiOptions, true)}
                          {renderSelectField("Jabatan", "jabatan", jabatanOptions)}
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Status Keanggotaan
                            </label>
                            {isEditMode ? (
                              <select
                                name="status_keanggotaan"
                                className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                  ${
                                    formData.status_keanggotaan === "Aktif"
                                      ? "bg-green-800 text-white border-green-700"
                                      : formData.status_keanggotaan === "Tidak Aktif"
                                      ? "bg-red-800 text-white border-red-700"
                                      : "bg-blue-950 text-white border-blue-800"
                                  }`}
                                value={formData.status_keanggotaan || "Aktif"}
                                onChange={handleChange}
                              >
                                {statusOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <p className="mt-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    anggota.status_keanggotaan?.toLowerCase() === "aktif"
                                      ? "bg-green-900 text-green-200"
                                      : "bg-red-900 text-red-200"
                                  }`}
                                >
                                  {anggota.status_keanggotaan || "-"}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Data Kepengurusan - Format baru dengan tanggal */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">4</span>
                          Data Kepengurusan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Tanggal Mulai Kepengurusan
                            </label>
                            {isEditMode ? (
                              <div>
                                <input
                                  type="date"
                                  name="tanggal_mulai_kepengurusan"
                                  className={`mt-1 w-full px-3 py-2 ${validationErrors.tanggal_mulai_kepengurusan ? 'bg-red-900/30 border-red-700' : 'bg-blue-950 border-blue-800'} border rounded-md text-white focus:outline-none focus:ring-2 ${validationErrors.tanggal_mulai_kepengurusan ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                  value={formatDateForInput(formData.tanggal_mulai_kepengurusan)}
                                  onChange={handleChange}
                                />
                                {validationErrors.tanggal_mulai_kepengurusan && (
                                  <p className="text-red-400 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" /> {validationErrors.tanggal_mulai_kepengurusan}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="mt-1 text-white">
                                {formatDate(anggota.tanggal_mulai_kepengurusan)}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Tanggal Selesai Kepengurusan
                            </label>
                            {isEditMode ? (
                              <p className="px-3 py-2 text-gray-400 italic bg-blue-900/30 border border-blue-800 rounded-md">
                                Otomatis dihitung 1 tahun dari tanggal mulai
                              </p>
                            ) : (
                              <p className="mt-1 text-white">
                                {anggota.tanggal_mulai_kepengurusan ? 
                                  getTanggalSelesaiKepengurusan(anggota.tanggal_mulai_kepengurusan) : "-"}
                              </p>
                            )}
                          </div>
                          
                          {/* Tampilkan periode kepengurusan (format tahun-tahun) */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Periode Kepengurusan
                            </label>
                            <p className="mt-1 text-white">
                              {getPeriodeKepengurusan(anggota.tanggal_mulai_kepengurusan)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Data Domisili */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">5</span>
                          Domisili
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {renderField("Kota/Kabupaten", "kota_kabupaten")}
                          {renderField("Provinsi", "provinsi")}
                        </div>
                      </div>

                      {/* Data Sanksi */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">6</span>
                          Sanksi & Predikat
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Sanksi
                            </label>
                            {isEditMode ? (
                              <select
                                name="sanksi"
                                className={`mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                  ${
                                    formData.sanksi === "Baik"
                                      ? "bg-green-800 text-white border-green-700"
                                      : "bg-yellow-800 text-white border-yellow-700"
                                  }`}
                                value={formData.sanksi || "Baik"}
                                onChange={handleChange}
                              >
                                {sanksiOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <p className="mt-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    anggota.sanksi?.toLowerCase() === "baik"
                                      ? "bg-green-900 text-green-200"
                                      : "bg-yellow-900 text-yellow-200"
                                  }`}
                                >
                                  {anggota.sanksi || "-"}
                                </span>
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Tanggal Sanksi
                            </label>
                            {isEditMode ? (
                              <input
                                type="date"
                                name="tanggal_sanksi"
                                className="mt-1 w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formatDateForInput(formData.tanggal_sanksi)}
                                onChange={handleChange}
                              />
                            ) : (
                              <p className="mt-1 text-white">
                                {formatDate(anggota.tanggal_sanksi)}
                              </p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Alasan Sanksi
                            </label>
                            {isEditMode ? (
                              <textarea
                                name="alasan_sanksi"
                                className="mt-1 w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.alasan_sanksi || ""}
                                onChange={handleChange}
                                rows={3}
                              />
                            ) : (
                              <p className="mt-1 text-white">
                                {anggota.alasan_sanksi || "-"}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Tanggal Perbaikan
                            </label>
                            {isEditMode ? (
                              <input
                                type="date"
                                name="tanggal_perbaikan"
                                className="mt-1 w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formatDateForInput(formData.tanggal_perbaikan)}
                                onChange={handleChange}
                              />
                            ) : (
                              <p className="mt-1 text-white">
                                {formatDate(anggota.tanggal_perbaikan)}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Status Tindak Lanjut
                            </label>
                            {isEditMode ? (
                              <select
                                name="status_tindak_lanjut_sanksi"
                                className="mt-1 w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.status_tindak_lanjut_sanksi || ""}
                                onChange={handleChange}
                              >
                                <option value="">Pilih Status</option>
                                {statusTindakLanjutOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <p className="mt-1 text-white">
                                {anggota.status_tindak_lanjut_sanksi || "-"}
                              </p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-blue-300 mb-1">
                              Tindakan Perbaikan
                            </label>
                            {isEditMode ? (
                              <textarea
                                name="tindakan_perbaikan"
                                className="mt-1 w-full px-3 py-2 bg-blue-950 border border-blue-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.tindakan_perbaikan || ""}
                                onChange={handleChange}
                                rows={3}
                              />
                            ) : (
                              <p className="mt-1 text-white">
                                {anggota.tindakan_perbaikan || "-"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DetailAnggotaModal;
