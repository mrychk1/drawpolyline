import * as mars3d from "mars3d";

class LineEditor {
  private map: mars3d.Map;
  private graphicLayer: mars3d.layer.GraphicLayer;
  private polylineEntity: mars3d.graphic.PolylineEntity | null = null;
  private onChangeCallback: ((positions: number[][]) => void) | null = null;

  constructor(mapInstance: mars3d.Map) {
    this.map = mapInstance;
    this.graphicLayer = new mars3d.layer.GraphicLayer({});
    this.map.addLayer(this.graphicLayer);
  }

  // 添加线
  public addLine(): Promise<number[][]> {
    return new Promise((resolve) => {
      this.graphicLayer.startDraw({
        name: "画线",
        type: "polyline",
        style: {
          color: "#ffff00",
          width: 3,
          clampToGround: true,
        },
        success: (entity: any) => {
          const positions = entity.toGeoJSON().geometry.coordinates;
          this.polylineEntity = entity;
          resolve(positions);
        },
      });
    });
  }

  // 更新线
  public updateLine(positions: number[][]) {
    if (this.polylineEntity) {
      this.polylineEntity.positions = positions;
      this.polylineEntity.redraw();
    }
  }

  // 设置位置变化回调
  public setOnChangeCallback(callback: (positions: number[][]) => void) {
    this.onChangeCallback = callback;
  }

  // 继续编辑线
  public startEditLine() {
    if (this.polylineEntity) {
      this.polylineEntity.startEditing();
      this.polylineEntity.on(
        [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
        (e: any) => {
          const graphic = e.graphic;
          const positions = graphic.toGeoJSON().geometry.coordinates;
          if (this.onChangeCallback) {
            this.onChangeCallback(positions);
          }
        }
      );
    }
  }

  // 结束编辑线
  public stopEditLine() {
    if (this.polylineEntity) {
      this.polylineEntity.stopEditing();
    }
  }
}

export default LineEditor;