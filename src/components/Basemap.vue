<template>
  <div id="mars3dContainer" class="mars3d-container">
    <button @click="toggleDrawLine" class="draw-button">
      {{ isDrawing ? '取消画线' : '画线' }}
    </button>
    <drawPolyline v-if="isDrawing" />
  </div>


</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import * as mars3d from "mars3d";
import drawPolyline from '../view/drawPolyline.vue';
import { MapSingleton } from '../utily/initmap'
import { mapOptions } from './utily/mapOptions'

let mapInstance: mars3d.Map | null = null
const isDrawing = ref(false) // 控制表单显示的状态
// 切换画线状态
const toggleDrawLine = () => {
  isDrawing.value = !isDrawing.value
}
onMounted(() => {
  // 初始化地图
  mapInstance = MapSingleton.getMapInstance("mars3dContainer",mapOptions)
})
</script>

<style scoped>
.draw-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.draw-button:hover {
  background-color: #45A049;
}
</style>