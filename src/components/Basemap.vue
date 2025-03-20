<template>
  <div id="mars3dContainer" class="mars3d-container">
    <div class="coordinates-table">
      <table>
        <thead>
          <tr>
            <th>经度</th>
            <th>纬度</th>
            <th>高度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in positions" :key="index">
            <td>
              <input 
                :value="item.lon"
                @input="e => updateCoordinate(index, 'lon', parseFloat(e.target.value))"
              />
            </td>
            <td>
              <input
                :value="item.lat"
                @input="e => updateCoordinate(index, 'lat', parseFloat(e.target.value))"
              />
            </td>
            <td>
              <input
                :value="item.height"
                @input="e => updateCoordinate(index, 'height', parseFloat(e.target.value))"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="editLine">继续编辑</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue'
import { Map } from '../utily/initmap'
import { mapOptions } from './utily/mapOptions'
import LineEditor from '../utily/draw2'
import * as mars3d from "mars3d";

// 响应式数据结构
interface Position {
  lon: number
  lat: number
  height: number
}

const positions = reactive<Position[]>([])
let mapInstance: mars3d.Map | null = null
let lineEditor: any = null

// 坐标更新方法（带防抖）
const updateCoordinate = (index: number, key: keyof Position, value: number) => {
  if (isNaN(value)) return
  
  positions[index][key] = value
  syncToMap()
}

// 同步到地图（带防抖）
let updateTimer: number
const syncToMap = () => {
  clearTimeout(updateTimer)
  updateTimer = window.setTimeout(updateMapGraphic, 100)
}

// 地图图形更新方法
const updateMapGraphic = () => {
  if (lineEditor) {
    const coords = positions.map(p => [p.lon, p.lat, p.height])
    lineEditor.updateLine(coords)
  }
}

onMounted(() => {
  // 初始化地图
  const map = new Map('mars3dContainer', mapOptions)
  mapInstance = map.getMapInstance()
  
  if (mapInstance) {
    lineEditor = new LineEditor(mapInstance)
    
    // 初始化绘制
    lineEditor.addLine().then((coords: number[][]) => {
      positions.splice(0, positions.length, ...coords.map(p => ({
        lon: p[0],
        lat: p[1],
        height: p[2] || 0
      })))
    })
  }
})

// 继续编辑图形的方法
const editLine = () => {
  if (lineEditor) {
    lineEditor.startEditingById({
      id: "exampleId",
      positions: positions.map(p => [p.lon, p.lat, p.height]),
      style: {
        color: '#FF0000',
        width: 4,
        clampToGround: true
      },
      attr: {
        name: "exampleName",
        other: {
          id: "exampleId",
          name: "exampleName"
        }
      }
    })
  }
}
</script>

<style scoped>
/* 保持原有样式不变 */
.coordinates-table {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  z-index: 999;
  color: white;
  max-height: 400px;
  overflow-y: auto;
}

table {
  border-collapse: collapse;
  min-width: 300px;
}

th, td {
  padding: 8px 12px;
  border: 1px solid #444;
}

th {
  background: #333;
}

input {
  width: 80px;
  padding: 4px;
  background: #222;
  border: 1px solid #444;
  color: #fff;
  text-align: center;
}

input:focus {
  outline: 2px solid #2196F3;
  background: #333;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #2196F3;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #1976D2;
}
</style>