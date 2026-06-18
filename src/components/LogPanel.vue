<template>
  <div class="log-panel">
    <h3 class="panel-title">日志</h3>
    <div class="log-list" ref="logListRef">
      <div 
        v-for="(log, index) in logs" 
        :key="index" 
        class="log-item" 
        :class="log.type"
      >
        <span class="log-time">[{{ log.timestamp }}]</span>
        <span class="log-message">{{ log.message }}</span>
      </div>
      <div v-if="logs.length === 0" class="empty-log">
        暂无日志
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.log-panel {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 300px;
}

.panel-title {
  color: white;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.log-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 10px;
}

.log-list::-webkit-scrollbar {
  width: 6px;
}

.log-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.log-item {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-item.info {
  background: rgba(52, 152, 219, 0.3);
  border-left: 3px solid #3498db;
  color: #aed6f1;
}

.log-item.success {
  background: rgba(46, 204, 113, 0.3);
  border-left: 3px solid #2ecc71;
  color: #abebc6;
}

.log-item.warning {
  background: rgba(243, 156, 18, 0.3);
  border-left: 3px solid #f39c12;
  color: #fad7a0;
}

.log-item.danger {
  background: rgba(231, 76, 60, 0.3);
  border-left: 3px solid #e74c3c;
  color: #f5b7b1;
}

.log-item.action {
  background: rgba(155, 89, 182, 0.3);
  border-left: 3px solid #9b59b6;
  color: #d2b4de;
}

.log-time {
  color: rgba(255, 255, 255, 0.5);
  margin-right: 8px;
  font-size: 10px;
}

.empty-log {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 20px;
  font-style: italic;
}
</style>
