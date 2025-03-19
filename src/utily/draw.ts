import * as Cesium from 'mars3d-cesium';

class DrawingTool {
  private viewer: Cesium.Viewer;
  private handler: Cesium.ScreenSpaceEventHandler;
  private positions: Cesium.Cartesian3[] = [];
  private pointEntities: Cesium.Entity[] = [];
  private activeShape: { entity: Cesium.Entity; index: number } | null = null;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  }

  public startDrawing() {
    // 左键点击：添加点或选择点
    this.handler.setInputAction((e: any) => {
      const ray = this.viewer.camera.getPickRay(e.position);
      if (!ray) return;
      const position = this.viewer.scene.globe.pick(ray, this.viewer.scene);

      if (!position) return;

      // 添加新点或选中已有点
      if (!this.selectExistingPoint(position)) {
        this.addNewPoint(position);
        this.updatePolyline();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动：拖拽点
    this.handler.setInputAction((e: any) => {
      if (!this.activeShape) return;
      const ray = this.viewer.camera.getPickRay(e.endPosition);
      if (!ray) return;
      const newPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

      if (newPosition) {
        this.positions[this.activeShape.index] = newPosition;
        this.activeShape.entity.position = new Cesium.ConstantPositionProperty(newPosition);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  private addNewPoint(position: Cesium.Cartesian3) {
    this.positions.push(position);

    // 创建可交互点实体
    const point = this.viewer.entities.add({
      position: position,
      point: {
        pixelSize: 12,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
    this.pointEntities.push(point);
  }

  private updatePolyline() {
    if (!this.viewer.entities.getById('editablePolyline')) {
      this.viewer.entities.add({
        id: 'editablePolyline',
        polyline: {
          positions: new Cesium.CallbackProperty(() => this.positions, false),
          width: 4,
          material: Cesium.Color.YELLOW,
          clampToGround: true
        }
      });
    }
  }

  private selectExistingPoint(position: Cesium.Cartesian3): boolean {
    const picked = this.viewer.scene.pick(position);
    if (picked && this.pointEntities.includes(picked.id)) {
      this.activeShape = {
        entity: picked.id,
        index: this.pointEntities.indexOf(picked.id)
      };
      return true;
    }
    return false;
  }
}

export default DrawingTool;