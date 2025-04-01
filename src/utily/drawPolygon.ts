import * as mars3d from "mars3d";

class PolygonEditor {
    private map: mars3d.Map;
    private graphicLayer: mars3d.layer.GraphicLayer;
    private polygonEntity: mars3d.graphic.PolygonEntity | null = null;
    private onChangeCallback: ((positions: number[][]) => void) | null = null;

    constructor(mapInstance: mars3d.Map) {
        this.map = mapInstance;
        this.graphicLayer = new mars3d.layer.GraphicLayer({
            id: "draw_polygon_layer",
        });
        this.map.addLayer(this.graphicLayer);
    }

    // 添加面
    public addPolygon(): Promise<number[][]> {
        return new Promise((resolve) => {
            this.graphicLayer.startDraw({
                name: "画面",
                type: "polygon",
                style: {
                    color: "#00ff00",
                    opacity: 0.5,
                    outline: true,
                    outlineColor: "#ffffff",
                    outlineWidth: 2,
                    clampToGround: true,
                },
                success: (entity: any) => {
                    const positions = entity.toGeoJSON().geometry.coordinates[0];
                    this.polygonEntity = entity;
                    resolve(positions);
                },
            });
        });
    }

    // 更新面
    public updatePolygon(positions: number[][]) {
        if (this.polygonEntity) {
            this.polygonEntity.positions = positions;
            this.polygonEntity.redraw();
            this.startEditPolygon();
        }
    }

    // 设置位置变化回调
    public setOnChangeCallback(callback: (positions: number[][]) => void) {
        this.onChangeCallback = callback;
    }

    // 继续编辑面
    public startEditPolygon() {
        if (this.polygonEntity) {
            this.polygonEntity.startEditing();
            this.polygonEntity.on(
                [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
                () => {
                    const polygonLayer = this.map.getLayerById("draw_polygon_layer");
                    if (polygonLayer) {
                        const positions = polygonLayer.toGeoJSON().features[0].geometry.coordinates[0];
                        if (this.onChangeCallback) {
                            this.onChangeCallback(positions);
                        }
                    }
                }
            );
        }
    }

    // 结束编辑面
    public stopEditPolygon() {
        if (this.polygonEntity) {
            this.polygonEntity.stopEditing();
        }
    }

    // 清空
    public clear() {
        this.graphicLayer.clear();
    }
}

class PolygonEditorManager {
    private polygonEditor: PolygonEditor | null = null;

    public initialize(mapInstance: mars3d.Map) {
        this.polygonEditor = new PolygonEditor(mapInstance);
    }

    public addPolygon(): Promise<number[][]> {
        if (this.polygonEditor) {
            return this.polygonEditor.addPolygon();
        }
        return Promise.reject("PolygonEditor not initialized");
    }

    public updatePolygon(positions: number[][]) {
        if (this.polygonEditor) {
            this.polygonEditor.updatePolygon(positions);
        }
    }

    public setOnChangeCallback(callback: (positions: number[][]) => void) {
        if (this.polygonEditor) {
            this.polygonEditor.setOnChangeCallback(callback);
        }
    }

    public startEditPolygon() {
        if (this.polygonEditor) {
            this.polygonEditor.startEditPolygon();
        }
    }

    public stopEditPolygon() {
        if (this.polygonEditor) {
            this.polygonEditor.stopEditPolygon();
        }
    }

    public clear() {
        if (this.polygonEditor) {
            this.polygonEditor.clear();
        }
    }
}

export const polygonEditorManager = new PolygonEditorManager();