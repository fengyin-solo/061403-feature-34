<template>
  <div class="game-over-overlay">
    <div class="game-over-content">
      <div class="skull-icon">💀</div>
      <h2 class="game-over-title">游戏结束</h2>
      <p class="game-over-reason">{{ reason }}</p>
      <div class="final-stats">
        <div class="stat-item">
          <span class="stat-label">存活天数</span>
          <span class="stat-value">{{ dayCount }} 天</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最终体温</span>
          <span class="stat-value">{{ temperature }}°C</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">收集木头</span>
          <span class="stat-value">{{ wood }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">制作工具</span>
          <span class="stat-value">{{ tools }}</span>
        </div>
      </div>
      <div class="game-over-actions">
        <button class="action-btn restart" @click="$emit('restart')">
          🔄 重新开始
        </button>
        <button class="action-btn load" @click="$emit('load')">
          📂 读取存档
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reason: {
    type: String,
    default: ''
  },
  dayCount: {
    type: Number,
    default: 1
  },
  temperature: {
    type: Number,
    default: 0
  },
  wood: {
    type: Number,
    default: 0
  },
  tools: {
    type: Number,
    default: 0
  }
})

defineEmits(['restart', 'load'])
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-over-content {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 20px;
  border: 2px solid rgba(231, 76, 60, 0.5);
  box-shadow: 0 0 50px rgba(231, 76, 60, 0.3);
  animation: slideUp 0.5s ease;
  max-width: 450px;
  width: 90%;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skull-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.game-over-title {
  color: #e74c3c;
  font-size: 36px;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
}

.game-over-reason {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.final-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.game-over-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.restart {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.action-btn.load {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}
</style>
