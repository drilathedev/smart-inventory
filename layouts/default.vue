<template>
  <div class="flex h-screen overflow-hidden bg-n-50">

    <!-- Desktop sidebar -->
    <aside
      class="hidden md:flex flex-col shrink-0 transition-[width] duration-300 ease-spring"
      :class="ui.sidebarOpen ? 'w-[220px]' : 'w-[60px]'"
    >
      <LayoutSidebar />
    </aside>

    <!-- Mobile overlay -->
    <Transition name="overlay">
      <div
        v-if="ui.mobileMenuOpen"
        class="md:hidden fixed inset-0 z-40 bg-n-900/40 backdrop-blur-[2px]"
        @click="ui.mobileMenuOpen = false"
      />
    </Transition>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <aside v-if="ui.mobileMenuOpen" class="md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-xl">
        <LayoutSidebar mobile @close="ui.mobileMenuOpen = false" />
      </aside>
    </Transition>

    <!-- Main content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Top header -->
      <header class="h-14 shrink-0 bg-n-0 border-b border-n-200 flex items-center px-4 gap-3 md:px-5">
        <button class="btn-icon md:hidden" @click="ui.mobileMenuOpen = true">
          <Icon name="lucide:menu" class="size-5" />
        </button>
        <button class="btn-icon hidden md:flex" @click="ui.sidebarOpen = !ui.sidebarOpen">
          <Icon name="lucide:panel-left" class="size-[18px]" />
        </button>

        <!-- Logo on mobile header -->
        <div class="md:hidden flex items-center gap-2 flex-1">
          <div class="size-7 rounded-lg bg-g-500 flex items-center justify-center">
            <Icon name="lucide:leaf" class="size-3.5 text-white" />
          </div>
          <span class="text-sm font-bold text-n-900">SmartStock</span>
        </div>

        <div class="hidden md:block flex-1" />

        <div class="flex items-center gap-2">
          <LayoutAlertBell />
          <div class="size-8 rounded-full bg-g-100 border-2 border-g-200 flex items-center justify-center">
            <span class="text-xs font-bold text-g-700">ST</span>
          </div>
        </div>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto" style="padding-bottom: calc(var(--nav-h) + env(safe-area-inset-bottom, 0px))">
        <div class="md:pb-0">
          <slot />
        </div>
      </div>
    </main>

    <!-- Mobile bottom nav -->
    <LayoutMobileNav class="md:hidden" />

    <!-- Toast -->
    <UiToast />
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
const ui = useUIStore()
</script>

<style scoped>
.overlay-enter-active,.overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from,.overlay-leave-to { opacity: 0; }
.drawer-enter-active,.drawer-leave-active { transition: transform 0.28s cubic-bezier(0.16,1,0.3,1); }
.drawer-enter-from,.drawer-leave-to { transform: translateX(-100%); }
</style>
