<template>
  <div class="day-night-indicator" :class="{ day: isDay, night: !isDay }">
    <div class="celestial-body">
      <svg v-if="isDay" class="sun-icon" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" fill="#FFD700" />
        <g v-for="i in 8" :key="i">
          <line 
            :x1="50 + 30 * Math.cos((i - 1) * Math.PI / 4)" 
            :y1="50 + 30 * Math.sin((i - 1) * Math.PI / 4)"
            :x2="50 + 45 * Math.cos((i - 1) * Math.PI / 4)"
            :y2="50 + 45 * Math.sin((i - 1) * Math.PI / 4)"
            stroke="#FFD700" 
            stroke-width="4" 
            stroke-linecap="round"
          />
        </g>
      </svg>
      <svg v-else class="moon-icon" viewBox="0 0 100 100">
        <path 
          d="M50 10 
             A35 35 0 1 0 50 90 
             A25 25 0 1 1 50 10" 
          fill="#F5F5DC"
        />
        <circle cx="40" cy="35" r="5" fill="#E0E0C0" />
        <circle cx="55" cy="50" r="7" fill="#E0E0C0" />
        <circle cx="45" cy="65" r="4" fill="#E0E0C0" />
      </svg>
    </div>
    <div class="indicator-info">
      <span class="period-text">{{ isDay ? '白天' : '夜晚' }}</span>
      <span class="day-count">第 {{ dayCount }} 天</span>
    </div>
    <div v-if="isBlizzard" class="blizzard-warning">
      <svg class="snowflake" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      </svg>
      <span>暴风雪</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isDay: {
    type: Boolean,
    default: true
  },
  dayCount: {
    type: Number,
    default: 1
  },
  isBlizzard: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.day-night-indicator {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.5s ease;
  position: relative;
}

.day-night-indicator.day {
  background: linear-gradient(135deg, rgba(255, 200, 100, 0.3), rgba(255, 150, 50, 0.3));
  border: 2px solid rgba(255, 200, 100, 0.5);
}

.day-night-indicator.night {
  background: linear-gradient(135deg, rgba(50, 50, 100, 0.5), rgba(30, 30, 60, 0.5));
  border: 2px solid rgba(100, 100, 150, 0.5);
}

.celestial-body {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun-icon {
  width: 55px;
  height: 55px;
  animation: rotate-sun 20s linear infinite;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
}

.moon-icon {
  width: 50px;
  height: 50px;
  animation: glow-moon 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(245, 245, 220, 0.6));
}

@keyframes rotate-sun {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glow-moon {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(245, 245, 220, 0.6)); }
  50% { filter: drop-shadow(0 0 20px rgba(245, 245, 220, 0.9)); }
}

.indicator-info {
  display: flex;
  flex-direction: column;
}

.period-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.day-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.blizzard-warning {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(231, 76, 60, 0.8);
  border-radius: 10px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  animation: shake 0.5s infinite;
}

.snowflake {
  width: 16px;
  height: 16px;
  animation: rotate-snow 2s linear infinite;
}

@keyframes rotate-snow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
</style>
