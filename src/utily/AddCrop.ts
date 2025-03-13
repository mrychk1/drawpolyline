import * as mars3d from 'mars3d'
import * as turf from '@turf/turf'
export class AddCrop {
    private map: mars3d.Map
    private cropName: string // 作物名称
    private cropColor: string // 作物颜色
    // private entityID: string // 实体ID
    private coordinates: number[][][] // 多个 多边形坐标
    private data: any
    private graphicLayer1: mars3d.layer.GraphicLayer
    private graphicLayer2: mars3d.layer.GraphicLayer
    constructor(map: mars3d.Map, cropName: string, cropColor: string, data: any) {
        this.map = map
        this.cropName = cropName
        this.cropColor = cropColor
        this.data = data
        this.coordinates = data.map((item: any) => {
            return item.coordinates
        })
        // 创建多边形图层
        this.graphicLayer1 = new mars3d.layer.GraphicLayer({
            id: this.cropName,
        })
        // 添加多边形图层到地图
        this.map.addLayer(this.graphicLayer1)
        this.graphicLayer2 = new mars3d.layer.GraphicLayer({
            id: this.cropName + '_center',
        })
        // 添加图层到地图
        this.map.addLayer(this.graphicLayer2)
    }

    // 添加基础多边形
    public addPolygon() {
        if (this.map) {
            // 创建多边形实体
            this.coordinates.forEach((item) => {
                const polygon = new mars3d.graphic.PolygonEntity({
                    positions: item,
                    style: {
                        color: this.cropColor,
                        opacity: 0.5,
                        outline: true,
                        outlineColor: '#ffffff',
                        outlineWidth: 2
                    }
                })
                // 添加多边形实体到图层
                this.graphicLayer1.addGraphic(polygon)
            })
        }
    }

    // 添加边框
    public addBorder(show: boolean) {
        if (this.map) {
            // 创建多边形边框实体
            this.data.forEach((item: any) => {
                const border = new mars3d.graphic.PolygonEntity({
                    positions: item.coordinates,
                    id: item.id,
                    style: {
                        fill: false,
                        outline: true,
                        outlineColor: this.cropColor,
                        outlineWidth: 2
                    },
                    show: show
                })
                // 添加多边形实体到图层
                this.graphicLayer1.addGraphic(border)
            })
        }
    }

    // 添加几何中心点图标
    public addCenterBillboard() {
        if (this.map) {
            this.data.forEach((item: any) => {
                const features = turf.points(item.coordinates)
                const center = turf.center(features).geometry.coordinates
                const billboard = new mars3d.graphic.BillboardEntity({
                    position: center,
                    id: item.id,
                    style: {
                        image: 'images/jdj.png',
                        scale: 2,
                    }
                })
                // 添加中心点到图层
                this.graphicLayer2.addGraphic(billboard)
            })
        }
    }

    // 监听几何中心点的鼠标事件
    public onCenterMouse() {
        // 鼠标移入中心点时，显示边框
        this.graphicLayer2.on(mars3d.EventType.mouseOver, (event: any) => {
            this.graphicLayer1.getGraphicById(event.graphic.id).show = true
        })
        // 鼠标移出中心点时，隐藏边框
        this.graphicLayer2.on(mars3d.EventType.mouseOut, (event: any) => {
            this.graphicLayer1.getGraphicById(event.graphic.id).show = false
        })
    }

    // 获取图层1
    public getLayer1() {
        return this.graphicLayer1
    }

    // 获取图层2
    public getLayer2() {
        return this.graphicLayer2
    }
}