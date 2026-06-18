<template>
  <div class="game-container" :class="gameBgClass">
    <div v-if="isBlizzard" class="snow-overlay"></div>
    
    <header class="game-header">
      <h1 class="game-title">❄️ 雪地生存 ❄️</h1>
      <div class="header-actions">
        <button class="mute-btn" @click="toggleMute">
          {{ muted ? '🔇' : '🔊' }}
        </button>
        <SaveManager 
          :slots="saveSlots"
          @save="handleSave"
          @load="handleLoad"
          @delete="handleDelete"
        />
      </div>
    </header>

    <main class="game-main">
      <div class="top-section">
        <DayNightIndicator 
          :isDay="isDay" 
          :dayCount="dayCount"
          :isBlizzard="isBlizzard"
        />
      </div>

      <div class="middle-section">
        <div class="left-panel">
          <Thermometer 
            :temperature="temperature" 
            :isDanger="isDanger"
          />
          <ResourcePanel 
            :heat="heat"
            :wood="wood"
            :food="food"
            :hide="hide"
            :tools="tools"
          />
        </div>

        <div class="center-panel">
          <div class="campfire-wrapper">
            <Campfire :heat="heat" :canvasSize="280" />
          </div>
          <div class="heat-info">
            <div class="heat-label">🔥 热量值</div>
            <div class="heat-bar-container">
              <div 
                class="heat-bar" 
                :style="{ width: heat + '%', background: getHeatGradient() }"
              ></div>
            </div>
            <div class="heat-value">{{ Math.round(heat) }}/100</div>
          </div>
        </div>

        <div class="right-panel">
          <ActionPanel 
            :isNight="isNight"
            :gameOver="gameOver"
            :canFire="canMakeFire"
            :canCraft="wood >= 2 && hide >= 1"
            :huntRate="huntSuccessRate"
            :food="food"
            @chop="handleChop"
            @hunt="handleHunt"
            @craft="handleCraft"
            @fire="handleFire"
            @eat="handleEat"
          />
        </div>
      </div>

      <div class="bottom-section">
        <LogPanel :logs="actionLog" />
      </div>
    </main>

    <GameOver 
      v-if="gameOver"
      :reason="gameOverReason"
      :dayCount="dayCount"
      :temperature="temperature"
      :wood="wood"
      :tools="tools"
      @restart="handleRestart"
      @load="showSaveManager"
    />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useGame } from './composables/useGame'
import { useAudio } from './composables/useAudio'
import Campfire from './components/Campfire.vue'
import Thermometer from './components/Thermometer.vue'
import DayNightIndicator from './components/DayNightIndicator.vue'
import ResourcePanel from './components/ResourcePanel.vue'
import ActionPanel from './components/ActionPanel.vue'
import LogPanel from './components/LogPanel.vue'
import SaveManager from './components/SaveManager.vue'
import GameOver from './components/GameOver.vue'

const {
  temperature,
  heat,
  wood,
  food,
  hide,
  tools,
  isDay,
  isNight,
  dayCount,
  isBlizzard,
  gameOver,
  gameOverReason,
  actionLog,
  isDanger,
  canMakeFire,
  huntSuccessRate,
  chopWood,
  hunt,
  makeTools,
  makeFire,
  eatFood,
  saveGame,
  loadGame,
  getSaveSlots,
  deleteSave,
  restartGame
} = useGame()

const {
  muted,
  playChop,
  playHunt,
  playSuccess,
  playFire,
  playWarning,
  playDanger,
  playEat,
  playCraft,
  playBlizzard,
  toggleMute
} = useAudio()

const saveSlots = computed(() => getSaveSlots())

const gameBgClass = computed(() => ({
  'day-bg': isDay.value && !isBlizzard.value,
  'night-bg': isNight.value && !isBlizzard.value,
  'blizzard-day-bg': isDay.value && isBlizzard.value,
  'blizzard-night-bg': isNight.value && isBlizzard.value
}))

function getHeatGradient() {
  if (heat.value > 60) return 'linear-gradient(to right, #ff6600, #ffcc00)'
  if (heat.value > 30) return 'linear-gradient(to right, #ff9933, #ffcc00)'
  return 'linear-gradient(to right, #cc3300, #ff6600)'
}

function handleChop() {
  playChop()
  chopWood()
}

function handleHunt() {
  playHunt()
  const oldFood = food.value
  hunt()
  if (food.value > oldFood) {
    playSuccess()
  }
}

function handleCraft() {
  if (wood.value >= 2 && hide.value >= 1) {
    playCraft()
    makeTools()
    playSuccess()
  } else {
    playWarning()
  }
}

function handleFire() {
  if (canMakeFire.value) {
    playFire()
    makeFire()
    playSuccess()
  } else {
    playWarning()
  }
}

function handleEat() {
  if (food.value > 0) {
    playEat()
    eatFood()
  } else {
    playWarning()
  }
}

function handleSave(slotName) {
  saveGame(slotName)
}

function handleLoad(slotName) {
  loadGame(slotName)
}

function handleDelete(slotName) {
  deleteSave(slotName)
}

function handleRestart() {
  restartGame()
}

function showSaveManager() {
}

watch(isBlizzard, (newVal) => {
  if (newVal) {
    playBlizzard()
  }
})

watch(isDanger, (newVal) => {
  if (newVal && !muted.value) {
    playDanger()
  }
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  padding: 20px;
  transition: background 1s ease;
  position: relative;
  overflow-x: hidden;
}

.day-bg {
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F7FA 100%);
}

.night-bg {
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.blizzard-day-bg {
  background: linear-gradient(180deg, #6b7b8c 0%, #8a9ba8 50%, #a8b5c0 100%);
}

.blizzard-night-bg {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.snow-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 40%);
  animation: snowfall 3s linear infinite;
}

@keyframes snowfall {
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 50px 100px, -50px 100px, 30px 100px; }
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
}

.game-title {
  color: white;
  font-size: 32px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.mute-btn {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.mute-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.game-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.top-section {
  display: flex;
  justify-content: center;
}

.middle-section {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 20px;
  align-items: start;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.center-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.campfire-wrapper {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.heat-info {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

.heat-label {
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.heat-bar-container {
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.heat-bar {
  height: 100%;
  border-radius: 8px;
  transition: width 0.5s ease;
}

.heat-value {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.right-panel {
  display: flex;
  flex-direction: column;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr;
}

@media (max-width: 1200px) {
  .middle-section {
    grid-template-columns: 1fr;
  }
  
  .left-panel,
  .right-panel {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .left-panel > *,
  .right-panel > * {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 600px) {
  .game-container {
    padding: 10px;
  }
  
  .game-title {
    font-size: 24px;
  }
  
  .game-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .left-panel,
  .right-panel {
    flex-direction: column;
  }
}
</style>
