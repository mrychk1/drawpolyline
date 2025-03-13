import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

// 引入css
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css"
import "mars3d/mars3d.css" // v3.8.6及之前版本使用 import "mars3d/dist/mars3d.css";

createApp(App).mount('#app')
