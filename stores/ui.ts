import { defineStore } from 'pinia'

type ToastType = 'success' | 'error' | 'info' | 'warning'

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen   = ref(true)
  const mobileMenuOpen = ref(false)
  const activeModal   = ref<string | null>(null)
  const toast         = ref<{ message: string; type: ToastType; id: string } | null>(null)
  const isMobile      = ref(false)

  const openModal  = (id: string) => { activeModal.value = id }
  const closeModal = () => { activeModal.value = null }

  const showToast = (message: string, type: ToastType = 'success') => {
    toast.value = { message, type, id: crypto.randomUUID() }
    setTimeout(() => { toast.value = null }, 3500)
  }

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) sidebarOpen.value = false
  }

  return { sidebarOpen, mobileMenuOpen, activeModal, toast, isMobile, openModal, closeModal, showToast, checkMobile }
})
