<template>
  <div class="thermometer-container" :class="{ danger: isDanger }">
    <div class="thermometer">
      <div class="thermometer-scale">
        <span v-for="i in 11" :key="i" class="scale-mark" :style="{ bottom: (i - 1) * 10 + '%' }">
          {{ (i - 1) * 10 }}
        </span>
      </div>
      <div class="thermometer-tube">
        <div 
          class="thermometer-liquid"
          :style="{ 
            height: temperature + '%',
            background: getTemperatureGradient()
          }"
        ></div>
      </div>
      <div class="thermometer-bulb" :style="{ background: getBulbColor() }"></div>
    </div>
    <div class="temperature-value">
      <span class="temp-number">{{ Math.round(temperature) }}</span>
      <span class="temp-unit">°C</span>
    </div>
    <div class="temperature-label">体温</div>
  </div>
</template>

<script setup>
const props = defineProps({
  temperature: {
    type: Number,
    default: 80
  },
  isDanger: {
    type: Boolean,
    default: false
  }
})

function getTemperatureGradient() {
  const temp = props.temperature
  if (temp <= 20) {
    return 'linear-gradient(to top, #000080, #0066cc, #0099ff)'
  } else if (temp <= 40) {
    return 'linear-gradient(to top, #0066cc, #0099ff, #33ccff)'
  } else if (temp <= 60) {
    return 'linear-gradient(to top, #0099ff, #33ccff, #66ffff)'
  } else if (temp <= 80) {
    return 'linear-gradient(to top, #ff6600, #ff9933, #ffcc00)'
  } else {
    return 'linear-gradient(to top, #ff3300, #ff6600, #ff9933)'
  }
}

function getBulbColor() {
  const temp = props.temperature
  if (temp <= 20) return '#0066cc'
  if (temp <= 40) return '#0099ff'
  if (temp <= 60) return '#33ccff'
  if (temp <= 80) return '#ff9933'
  return '#ff3300'
}
</script>

<style scoped>
.thermometer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.thermometer-container.danger {
  animation: pulse-danger 1s infinite;
}

@keyframes pulse-danger {
  0%, 100% { box-shadow: 0 0 20px rgba(231, 76, 60, 0.5); }
  50% { box-shadow: 0 0 40px rgba(231, 76, 60, 0.8); }
}

.thermometer {
  position: relative;
  width: 40px;
  height: 180px;
  margin-bottom: 10px;
}

.thermometer-scale {
  position: absolute;
  left: -25px;
  top: 0;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.scale-mark {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
  width: 20px;
}

.thermometer-tube {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 5px;
  width: 16px;
  height: 155px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.thermometer-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 6px;
  transition: height 0.5s ease, background 0.5s ease;
  box-shadow: 0 0 10px currentColor;
}

.thermometer-bulb {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: background 0.5s ease;
  box-shadow: 0 0 15px currentColor;
}

.temperature-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 5px;
}

.temp-number {
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.temp-unit {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 2px;
}

.temperature-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
