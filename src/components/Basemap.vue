<template>
  <div id="mars3dContainer" class="mars3d-container">
    <!-- <div>这是一个mars3d地图</div> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
// 引入地图初始化方法
import { Map } from '../utily/initmap'
// 引入地图配置
import { mapOptions } from './utily/mapOptions'
// 引入添加多边形的方法
import { AddCrop } from '../utily/AddCrop'
// 引入多边形数据
import { apple, banana, orange } from '../data/crop'
onMounted(() => {
  // 初始化地图
  const mapInstance = new Map('mars3dContainer', mapOptions)
  // 获取地图
  const map = mapInstance.getMapInstance()
  if (map) {
    // 添加多边形
    const appleCrop = new AddCrop(map, "apple", "#ff0000", apple)
    appleCrop.addBorder(false)
    appleCrop.addCenterBillboard()
    appleCrop.onCenterMouse()
    const bananaCrop = new AddCrop(map, "banana", "#00ff00", banana)
    bananaCrop.addBorder(false)
    bananaCrop.addCenterBillboard()
    bananaCrop.onCenterMouse()
    const orangeCrop = new AddCrop(map, "orange", "#0000ff", orange)
    orangeCrop.addBorder(false)
    orangeCrop.addCenterBillboard()
    orangeCrop.onCenterMouse()
  }


  // 设置一个集合图层
  // const GroupLayer = new mars3d.layer.GroupLayer({
  //   layers: [a, b, o]
  // })
  // map.addLayer(GroupLayer)
  // // 监听图层集合

})
</script>

<style scoped>
.mars3d-container {
  width: 100%;
  height: 100%;
}
</style>