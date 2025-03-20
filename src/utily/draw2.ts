import * as mars3d from "mars3d";

class LineEditor {
  private map: mars3d.Map;
  private graphicLayer: mars3d.layer.GraphicLayer;
  private eventTarget: mars3d.BaseClass;

  constructor(mapInstance: mars3d.Map) {
    this.map = mapInstance;
    this.eventTarget = new mars3d.BaseClass();
    this.graphicLayer = new mars3d.layer.GraphicLayer({
      // isAutoEditing: true,
    });
    this.map.addLayer(this.graphicLayer);

    this.initGraphicLayer();
  }

  private initGraphicLayer() {
    this.graphicLayer.on(
      [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
      (e: any) => {
        const graphic = e.graphic;
        // this.startEditing(graphic);
        this.eventTarget.fire("editStart", e);
      }
    );
  }

  public addLine(): Promise<any[]> {
    return new Promise((resolve) => {
      this.graphicLayer.startDraw({
        name: "画线",
        type: "polyline",
        style: {
          color: "#ffff00",
          width: 3,
          clampToGround: true
        },
        success: (entity: any) => {
          const positions = entity.toGeoJSON().geometry.coordinates;
          // console.log("positions", positions);
          resolve(positions);
        },
        // updateDrawPosition: (entity: any) => {
        //   this.eventTarget.fire("updateDrawPosition", entity);
        // }
      });
    });
  }

  // 
}

export default LineEditor;