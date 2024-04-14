"use strict";
class Scene {
    constructor(name, materials, backgroundColor, lighting, camera, collidables) {
        this.name = name;
        this.materials = materials;
        this.backgroundColor = backgroundColor;
        this.lighting = lighting;
        this.camera = camera;
        this.collidables = collidables;
    }
    static create() {
        return new Scene(null, null, null, null, null, null);
    }
    static demo() {
        var imageRTBang = new Image2("RTBang", [
            "RRRRRRRRRRRRRRRR",
            "RRcccccRcccccRcR",
            "RRcRRRcRRRcRRRcR",
            "RRcRRRcRRRcRRRcR",
            "RRcccccRRRcRRRcR",
            "RRcRRcRRRRcRRRRR",
            "RRcRRRcRRRcRRRcR",
            "RRRRRRRRRRRRRRRR",
        ]);
        var materialRTBang = new Material("RTBang", Color.Instances().White, 1, // diffuse
        1, // specular
        .2, // shininess
        10, // diffuse
        new Texture("RTBang", imageRTBang));
        var meshMonolith = MeshHelper.transformMeshVertexPositions(MeshHelper.buildCubeUnit("Monolith", materialRTBang), new TransformMultiple([
            new TransformScale(new Coords(40, 10, 90)),
            new TransformTranslate(new Coords(0, 0, -90)),
        ]));
        var meshGround = new Mesh("Ground", 
        // vertices
        [
            new Vertex(new Coords(-1000, -1000, 0)),
            new Vertex(new Coords(1000, -1000, 0)),
            new Vertex(new Coords(1000, 1000, 0)),
            new Vertex(new Coords(-1000, 1000, 0)),
        ], 
        // faces
        [
            new Face(Material.Instances().Green.name, [3, 2, 1, 0], null, null)
        ]);
        var imageEyeball = new Image2("ImageEyeball", [
            "k", "b", "w", "w", "w", "w", "w", "w", "w", "w"
        ]);
        var materialEyeball = new Material("MaterialEyeball", Color.Instances().White, 1, // diffuse
        1, // specular
        .2, // shininess
        10, // diffuse
        new Texture("TextureEyeball", imageEyeball));
        var materials = [
            materialEyeball,
            materialRTBang,
            Material.Instances().Green,
        ];
        var sphereEyeball = new Sphere("SphereEyeball", materialEyeball.name, 100, // radius
        new Coords(200, 200, -270), new Orientation(new Coords(1, 0, 0), new Coords(1, 1, 0) // down = SE
        ));
        var displaySize = new Coords(320, 240, 960);
        var scene = new Scene("Scene0", materials, Color.Instances().BlueDark, // backgroundColor
        new Lighting(
        // lights
        [
            //new LightAmbient(.1),
            new LightPoint(30000, new Coords(-200, -200, -300)),
            new LightPoint(60000, new Coords(200, -200, -300)),
            new LightPoint(30000, new Coords(200, 200, -300)),
        ]), new Camera(displaySize.clone(), 200, // focalLength
        new Coords(-150, -300, -60), // pos
        new Orientation(new Coords(1, 2, 0), // forward
        new Coords(0, 0, 1) // down
        )), 
        // collidables
        [
            sphereEyeball,
            meshMonolith,
            meshGround,
        ]);
        return scene;
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
        if (this._materialsByName == null) {
            this._materialsByName = new Map(this.materials.map(x => [x.name, x]));
        }
        return this._materialsByName.get(name);
    }
    // Serializable.
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        this.materials.forEach(x => typeSetOnObject(Material, x));
        typeSetOnObject(Color, this.backgroundColor);
        typeSetOnObject(Lighting, this.lighting);
        typeSetOnObject(Camera, this.camera);
        this.collidables.forEach(x => ShapeHelper.typeSetOnShape(x));
        return this;
    }
    fromJson(objectAsJson) {
        return SerializableHelper.objectOfTypeFromJson(Scene, objectAsJson);
    }
    static fromJson(objectAsJson) {
        return Scene.create().fromJson(objectAsJson);
    }
    toJson() {
        var sceneAsJson = JSON.stringify(this, null, 4);
        return sceneAsJson;
    }
}
