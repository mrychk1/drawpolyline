<template>
  <div id="mars3dContainer" class="mars3d-container">
    <!-- <div>这是一个mars3d地图</div> -->

    <!-- <div class="button" @click="flyto">flyto</div>  -->
    <!-- 展示画的线的点坐标信息 -->
    <div class="button">
      <div v-for="(item, index) in positions" :key="index">
        <input v-model="item[0]">
        <input v-model="item[1]">
        <input v-model="item[2]">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// 引入地图初始化方法
import { Map } from '../utily/initmap'
// 引入地图配置
import { mapOptions } from './utily/mapOptions'
// 引入添加多边形的方法
import { AddCrop } from '../utily/AddCrop'
// 引入多边形数据
import { apple, banana, orange } from '../data/crop'

// 引入画图
import DrawingTool from '../utily/draw';
import * as Cesium from 'mars3d-cesium';
import * as mars3d from "mars3d";
import LineEditor from '../utily/draw2'
let appleCrop: AddCrop
let positions = ref([[]])
onMounted(() => {
  // 初始化地图
  const mapInstance = new Map('mars3dContainer', mapOptions)
  // 获取地图
  const map = mapInstance.getMapInstance()
  if (map) {
    // 添加多边形
    appleCrop = new AddCrop(map, "apple", "#ff0000", apple)
    // appleCrop.addBorder(true)
    // 添加墙
    // appleCrop.addWall()
    // 添加遮罩
    // appleCrop.addMask()
    // 自定义画线
    // const drawingTool = new DrawingTool(map.viewer);
    // drawingTool.startDrawing();

    // // mar3d自带的画线功能
    const lineEditor = new LineEditor(map)
    // 添加线条
    lineEditor.addLine().then((e: any) => {
      // 设置展示的点坐标
      positions.value = e
    })
    // // 保存文件
    // const flyTableData:any = []; // 你的数据
    // lineEditor.saveFile(flyTableData);

    // 通过ID开始编辑
    const graphicObj = {
      id: "exampleId",
      positions: [], // 你的坐标数据
      style: {
        color: Cesium.Color.RED.withAlpha(0.5),
        width: 5,
        clampToGround: true
      }, // 你的样式数据
      attr: {
        name: "exampleName",
        other: {
          id: "exampleId",
          name: "exampleName"
        }
      } // 你的属性数据
    };
    graphicObj.positions = positions.value.flat()
    lineEditor.startEditingById(graphicObj);



    // appleCrop.addBorder(false)
    // appleCrop.addCenterBillboard()
    // appleCrop.onCenterMouse()
    // const bananaCrop = new AddCrop(map, "banana", "#00ff00", banana)
    // bananaCrop.addBorder(false)
    // bananaCrop.addCenterBillboard()
    // bananaCrop.onCenterMouse()
    // const orangeCrop = new AddCrop(map, "orange", "#0000ff", orange)
    // orangeCrop.addBorder(false)
    // orangeCrop.addCenterBillboard()
    // orangeCrop.onCenterMouse()
  }


  // 设置一个集合图层
  // const GroupLayer = new mars3d.layer.GroupLayer({
  //   layers: [a, b, o]
  // })
  // map.addLayer(GroupLayer)
  // // 监听图层集合

})

const flyto = () => {
  // console.log('flyto')
  appleCrop.addCenterBillboardAndFlyTo()
}
</script>

<style scoped>
.mars3d-container {
  width: 100%;
  height: 100%;
}

.button {
  position: absolute;
  top: 100px;
  left: 100px;
  color: #fff;
  width: 100px;
  height: 100px;
  background-color: #000;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 999;
}
</style>