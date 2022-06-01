import { defineStore } from 'pinia'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [] as File[],
  }),
  getters: {
    getFiles: (state) => state.files,
  },
  actions: {
    addFiles(files: File[]) {
      this.files = [...this.files, ...files]
    },
  },
})
