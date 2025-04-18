import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const DetailAnggotaModal = ({ anggota, onClose }) => {
  return (
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-100"
                >
                  Detail Anggota
                </Dialog.Title>

                <div className="mt-4 space-y-4 text-gray-300">
                  <div>
                    <label className="block text-sm font-medium">Nama</label>
                    <p className="mt-1">{anggota.nama}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium">NPM</label>
                    <p className="mt-1">{anggota.npm}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Divisi</label>
                    <p className="mt-1">{anggota.divisi}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Jabatan</label>
                    <p className="mt-1">{anggota.jabatan}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Angkatan</label>
                    <p className="mt-1">{anggota.angkatan}</p>
                  </div>
                </div>

                <div className="mt-6">
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
  )
}

export default DetailAnggotaModal
