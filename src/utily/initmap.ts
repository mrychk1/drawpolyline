import * as mars3d from 'mars3d'

export class Map {
    private map: mars3d.Map | null = null

    constructor(containerId: string, options?: any) {
        this.initMap(containerId, options)
    }

    private initMap(containerId: string, options?: any): void {
        try {
            this.map = new mars3d.Map(containerId, options)
            console.log('Mars3D map initialized successfully')
        } catch (error) {
            console.error('Error initializing Mars3D map:', error)
        }
    }

    public setMapInstance(map: mars3d.Map): void {
        this.map = map
    }

    public getMapInstance(): mars3d.Map | null {
        return this.map
    }
}