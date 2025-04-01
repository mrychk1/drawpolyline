<template>
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
                        <input :value="item.lon"
                            @input="e => updateCoordinate(index, 'lon', parseFloat(e.target.value))" />
                    </td>
                    <td>
                        <input :value="item.lat"
                            @input="e => updateCoordinate(index, 'lat', parseFloat(e.target.value))" />
                    </td>
                    <td>
                        <input :value="item.height"
                            @input="e => updateCoordinate(index, 'height', parseFloat(e.target.value))" />
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="startEditPolygon">开始编辑</button>
        <button @click="addPoint">添加点</button>
        <button @click="endEditPolygon">结束编辑</button>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import * as mars3d from "mars3d";
import { MapSingleton } from '../utily/initmap'
import { polygonEditorManager } from '../utily/drawPolygon'

// 响应式数据结构
interface Position {
    lon: number
    lat: number
    height: number
}

const positions = reactive<Position[]>([])
let mapInstance: mars3d.Map | null = null

// 更新坐标
const updateCoordinate = (index: number, key: keyof Position, value: number) => {
    if (isNaN(value)) return
    positions[index][key] = value
    syncToMap()
}

// 同步到地图
let updateTimer: number
const syncToMap = () => {
    clearTimeout(updateTimer)
    updateTimer = window.setTimeout(() => {
        const coords = positions.map(p => [p.lon, p.lat, p.height])
        polygonEditorManager.updatePolygon(coords)
    }, 100)
}

// 开始编辑
const startEditPolygon = () => {
    polygonEditorManager.startEditPolygon()
}

// 添加点
const addPoint = () => {
    positions.push({
        lon: 120,
        lat: 30,
        height: 0
    })
    syncToMap()
}

// 结束编辑
const endEditPolygon = () => {
    polygonEditorManager.stopEditPolygon()
}

onMounted(() => {
    // 初始化地图
    mapInstance = MapSingleton.MapInstance("mars3dContainer")
    if (mapInstance) {
        polygonEditorManager.initialize(mapInstance)

        // 设置位置变化回调
        polygonEditorManager.setOnChangeCallback((coords: number[][]) => {
            positions.splice(0, positions.length, ...coords.map(p => ({
                lon: p[0],
                lat: p[1],
                height: p[2] || 0
            })))
        })

        // 初始化绘制
        polygonEditorManager.addPolygon().then((coords: number[][]) => {
            positions.splice(0, positions.length, ...coords.map(p => ({
                lon: p[0],
                lat: p[1],
                height: p[2] || 0
            })))
        })
    }
})

onUnmounted(() => {
    polygonEditorManager.clear()
})
</script>

<style scoped>
.coordinates-table {
    position: absolute;
    top: 60px;
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

th,
td {
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