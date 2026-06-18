<template>
  <div class="campfire-container">
    <canvas ref="canvasRef" :width="canvasSize" :height="canvasSize"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  heat: {
    type: Number,
    default: 0
  },
  canvasSize: {
    type: Number,
    default: 200
  }
})

const canvasRef = ref(null)
let animationId = null
let particles = []

class Particle {
  constructor(x, y, size, speed, color) {
    this.x = x
    this.y = y
    this.size = size
    this.speed = speed
    this.color = color
    this.alpha = 1
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.05 + Math.random() * 0.05
  }

  update() {
    this.y -= this.speed
    this.wobble += this.wobbleSpeed
    this.x += Math.sin(this.wobble) * 0.5
    this.alpha -= 0.015
    this.size *= 0.98
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function getFlameColors(intensity) {
  if (intensity > 70) {
    return ['#fff7e6', '#ffd700', '#ff8c00', '#ff4500', '#dc143c']
  } else if (intensity > 40) {
    return ['#ffd700', '#ff8c00', '#ff4500', '#dc143c', '#8b0000']
  } else if (intensity > 10) {
    return ['#ff8c00', '#ff4500', '#dc143c', '#8b0000', '#4a0000']
  } else {
    return ['#8b0000', '#4a0000', '#2d0000', '#1a0000']
  }
}

function createParticle(centerX, baseY, intensity) {
  const colors = getFlameColors(intensity)
  const color = colors[Math.floor(Math.random() * colors.length)]
  const size = 2 + Math.random() * (intensity / 15)
  const speed = 1 + Math.random() * (intensity / 25)
  const x = centerX + (Math.random() - 0.5) * (intensity / 2.5)
  const y = baseY - Math.random() * 10
  
  return new Particle(x, y, size, speed, color)
}

function drawLogs(ctx, centerX, baseY) {
  ctx.fillStyle = '#4a2c0a'
  ctx.strokeStyle = '#2d1a05'
  ctx.lineWidth = 2
  
  ctx.save()
  ctx.translate(centerX - 30, baseY + 10)
  ctx.rotate(-0.3)
  ctx.fillRect(0, 0, 60, 12)
  ctx.strokeRect(0, 0, 60, 12)
  ctx.restore()
  
  ctx.save()
  ctx.translate(centerX - 30, baseY + 15)
  ctx.rotate(0.3)
  ctx.fillRect(0, 0, 60, 12)
  ctx.strokeRect(0, 0, 60, 12)
  ctx.restore()
  
  ctx.fillStyle = '#1a0a00'
  for (let i = 0; i < 5; i++) {
    const emberX = centerX - 20 + i * 10
    const emberY = baseY + 5 + Math.random() * 10
    ctx.beginPath()
    ctx.arc(emberX, emberY, 2 + Math.random() * 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawFlameBase(ctx, centerX, baseY, intensity) {
  if (intensity <= 0) return
  
  const gradient = ctx.createRadialGradient(
    centerX, baseY, 0,
    centerX, baseY, intensity / 1.5
  )
  gradient.addColorStop(0, 'rgba(255, 200, 50, 0.4)')
  gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)')
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
  
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, baseY, intensity / 1.5, 0, Math.PI * 2)
  ctx.fill()
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const baseY = canvas.height - 50
  const intensity = props.heat
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  drawFlameBase(ctx, centerX, baseY, intensity)
  drawLogs(ctx, centerX, baseY)
  
  if (intensity > 0) {
    const particleCount = Math.floor(intensity / 5) + 3
    for (let i = 0; i < particleCount; i++) {
      if (Math.random() > 0.5) {
        particles.push(createParticle(centerX, baseY, intensity))
      }
    }
  }
  
  particles = particles.filter(p => p.alpha > 0 && p.y > 0)
  particles.forEach(p => {
    p.update()
    p.draw(ctx)
  })
  
  if (intensity > 0) {
    const glowIntensity = intensity / 100
    const glowGradient = ctx.createRadialGradient(
      centerX, baseY - intensity / 3, 0,
      centerX, baseY - intensity / 3, intensity
    )
    glowGradient.addColorStop(0, `rgba(255, 200, 100, ${0.3 * glowIntensity})`)
    glowGradient.addColorStop(1, 'rgba(255, 100, 50, 0)')
    
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(centerX, baseY - intensity / 3, intensity, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }
  
  animationId = requestAnimationFrame(animate)
}

watch(() => props.heat, (newVal, oldVal) => {
  if (newVal > oldVal && newVal > 20) {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const canvas = canvasRef.value
        if (canvas) {
          const centerX = canvas.width / 2
          const baseY = canvas.height - 50
          particles.push(createParticle(centerX, baseY, newVal))
        }
      }, i * 50)
    }
  }
})

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.campfire-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  border-radius: 50%;
  background: radial-gradient(circle, #1a1a2e 0%, #0f0f1a 100%);
  box-shadow: 0 0 30px rgba(255, 100, 50, 0.3);
}
</style>
