import axios from 'axios'

export const anggotaApi = {
  getAnggota: async (params) => {
    const response = await axios.get('/anggota', { params })
    return response.data
  },
  updateAnggota: async (id, data) => {
    const response = await axios.put(`/anggota/${id}`, data)
    return response.data
  }
}
