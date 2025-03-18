export const mapOptions = {
    scene: {
        center: { "lat": 22.411716, "lng": 114.089777, "alt": 123774.2, "heading": 357.3, "pitch": -84.9 },
        fxaa: true,
        webgl: {
            // alpha: true, // 是否支持webgl透明
            antialias: true // 是否开启抗锯齿
            // preserveDrawingBuffer: true, // 是否保存绘图缓冲区
            // failIfMajorPerformanceCaveat: false, // 如果性能不好是否显示警告
        },
        boolean: true // 是否开启地球光照
    },
    terrain: {
      url: 'https://data.mars3d.cn/terrain',
      show: true
    },
    basemaps: [
        { name: '天地图', type: 'tdt', layer: 'img_d', show: true },
        { name: '天地图注记', type: 'tdt', layer: 'img_z', show: true }
    ],
}