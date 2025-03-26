import * as mars3d from "mars3d";

export class MapSingleton {
  private static map: mars3d.Map | null = null;

  private constructor(containerId: string, options?: any) {
    MapSingleton.map = new mars3d.Map(containerId, options);
  }

  public static getMapInstance(containerId: string, options?: any): mars3d.Map {
    if (!MapSingleton.map) {
      new MapSingleton(containerId, options);
    }
    return MapSingleton.map as mars3d.Map;
  }
}
