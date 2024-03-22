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
    materialByName(name) {
        return this._materialsByName.get(name);
    }
}
