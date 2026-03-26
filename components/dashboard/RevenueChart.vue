<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps<{ data: { date: string; revenue: number; profit: number }[] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const build = () => {
  if (!canvas.value) return
  chart?.destroy()
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: props.data.map(d => d.date),
      datasets: [
        {
          label: 'Revenue',
          data: props.data.map(d => d.revenue),
          backgroundColor: 'rgba(47,107,63,0.10)',
          borderColor: 'rgba(47,107,63,0.60)',
          borderWidth: 1.5,
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: 'Profit',
          data: props.data.map(d => d.profit),
          backgroundColor: 'rgba(47,107,63,0.50)',
          borderWidth: 0,
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top', align: 'end',
          labels: {
            boxWidth: 10, boxHeight: 10, borderRadius: 3, useBorderRadius: true,
            font: { size: 10, family: 'DM Sans' }, color: '#857d72', padding: 12,
          },
        },
        tooltip: {
          backgroundColor: '#1a1714', cornerRadius: 10, padding: 10,
          titleFont: { size: 10, family: 'DM Mono' },
          bodyFont: { size: 11, family: 'DM Mono' },
          callbacks: { label: ctx => ` ${ctx.dataset.label}: €${(ctx.raw as number).toFixed(2)}` },
        },
      },
      scales: {
        x: {
          grid: { display: false }, border: { display: false },
          ticks: { font: { size: 9, family: 'DM Sans' }, color: '#b0a99f', maxRotation: 0, maxTicksLimit: 7 },
        },
        y: {
          grid: { color: '#f2efec' }, border: { display: false },
          ticks: { font: { size: 9, family: 'DM Mono' }, color: '#b0a99f', callback: v => `€${v}` },
        },
      },
    },
  })
}

onMounted(() => nextTick(build))
watch(() => props.data, () => nextTick(build), { deep: true })
onUnmounted(() => chart?.destroy())
</script>
