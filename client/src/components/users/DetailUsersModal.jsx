import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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

const DetailAnggotaModal = ({ anggota, onClose }) => {
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

  return (
    <>
      {/* Style tag untuk scrollbar */}
      <style>{scrollbarStyles}</style>

      <Transition appear show={!!anggota} as={Fragment}>
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
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-100 border-b border-blue-800 pb-3 mb-4"
                  >
                    Detail Anggota
                  </Dialog.Title>

                  {/* Tambahkan class modern-scrollbar ke elemen scrollable */}
                  <div className="overflow-y-auto max-h-[70vh] modern-scrollbar pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                      {/* Data Identitas Pribadi */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">
                          Data Pribadi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Nama Anggota
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.nama_anggota || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              NPM
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.npm || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Jenis Kelamin
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.jenis_kelamin || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Email
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.email || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Nomor Telepon
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.nomor_telepon || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              WhatsApp
                            </label>
                            <p className="mt-1">
                              {anggota.nomor_telepon ? (
                                <a
                                  href={`https://wa.me/${anggota.nomor_telepon.replace(
                                    /[^0-9]/g,
                                    ""
                                  )}`}
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
                              ) : (
                                "-"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Data Akademik */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">
                          Data Akademik
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Kategori Kelas
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.kategori_kelas || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Kelas
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.kelas || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Angkatan
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.angkatan || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Data Keanggotaan */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">
                          Keanggotaan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Divisi
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.divisi || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Jabatan
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.jabatan || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Status Keanggotaan
                            </label>
                            <p className="mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  anggota.status_keanggotaan?.toLowerCase() ===
                                  "aktif"
                                    ? "bg-green-900 text-green-200"
                                    : "bg-red-900 text-red-200"
                                }`}
                              >
                                {anggota.status_keanggotaan || "-"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Data Domisili */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">
                          Domisili
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Kota/Kabupaten
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.kota_kabupaten || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Provinsi
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.provinsi || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Data Sanksi */}
                      <div className="md:col-span-2 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                        <h4 className="text-white font-medium mb-2">
                          Sanksi & Predikat
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Sanksi
                            </label>
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
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Tanggal Sanksi
                            </label>
                            <p className="mt-1 text-white">
                              {formatDate(anggota.tanggal_sanksi)}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-blue-300">
                              Alasan Sanksi
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.alasan_sanksi || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Tanggal Perbaikan
                            </label>
                            <p className="mt-1 text-white">
                              {formatDate(anggota.tanggal_perbaikan)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-300">
                              Status Tindak Lanjut
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.status_tindak_lanjut_sanksi || "-"}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-blue-300">
                              Tindakan Perbaikan
                            </label>
                            <p className="mt-1 text-white">
                              {anggota.tindakan_perbaikan || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                      onClick={onClose}
                    >
                      Tutup
                    </button>
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
