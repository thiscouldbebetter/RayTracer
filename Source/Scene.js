"use strict";
class Scene {
    constructor(name, materials, backgroundColor, lighting, camera, collidables) {
        this.name = name;
        this.materials = materials;
        this.backgroundColor = backgroundColor;
        this.lighting = lighting;
        this.camera = camera;
        this.collidables = collidables;
        this._materialsByName =
            new Map(this.materials.map(x => [x.name, x]));
    }
    loadAndSendToCallback(callback) {
        var materialsCount = this.materials.length;
        var materialsLoadedSoFarCount = 0;
        var scene = this;
        this.materials.forEach(m => m.loadAndSendToCallback((materialLoaded) => {
            materialsLoadedSoFarCount++;
            if (materialsLoadedSoFarCount >= materialsCount) {
                callback(scene);
            }
        }));
    }
    materialByName(name) {
        return this._materialsByName.get(name);
    }
}
