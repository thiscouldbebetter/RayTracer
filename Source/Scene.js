"use strict";
class Scene {
    constructor(name, materials, backgroundColor, lighting, camera, shapeDefinitions, shapeBuilders) {
        this.name = name;
        this.materials = materials;
        this.backgroundColor = backgroundColor;
        this.lighting = lighting;
        this.camera = camera;
        this.shapeDefinitions = shapeDefinitions;
        this.shapeBuilders = shapeBuilders;
    }
    static create() {
        return new Scene(null, null, null, null, null, null, null);
    }
    static demo(camera) {
        var materialEyeball = this.demo_MaterialEyeball();
        var materialGround = Material.Instances().Green;
        var materialRTBang = this.demo_MaterialRTBang();
        var materials = [
            materialEyeball,
            materialGround,
            materialRTBang
        ];
        var meshMonolith = this.demo_MeshMonolith(materialRTBang);
        var meshGround = this.demo_MeshGround(materialGround);
        var sphereEyeball = this.demo_SphereEyeball(materialEyeball);
        var lighting = this.demo_Lighting();
        var shapeDefinitions = [
            sphereEyeball,
            meshMonolith,
            meshGround
        ];
        var shapeBuilders = shapeDefinitions.map(x => ShapeBuilder.fromShapeDefinitionNameAndPos(x.name, Coords.create()));
        var scene = new Scene("Scene0", materials, Color.Instances().BlueDark, // backgroundColor
        lighting, camera, shapeDefinitions, shapeBuilders);
        return scene;
    }
    static demo_Camera(shouldUseParallelProjection) {
        var displaySize = Coords.fromXYZ(320, 240, 960);
        var focalLength = shouldUseParallelProjection
            ? null
            : 200;
        var camera = Camera.fromViewSizeFocalLengthPosAndOrientation(displaySize.clone(), focalLength, Coords.fromXYZ(-150, -300, -100), // pos
        Orientation.fromForwardAndDown(Coords.fromXYZ(1, 2, .1), Coords.fromXYZ(0, 0, 1)));
        return camera;
    }
    static demo_Lighting() {
        return Lighting.fromLights([
            LightAmbient.fromIntensity(.05),
            LightDirectional
                .fromIntensityAndDirection(.5, Coords.fromXYZ(1, 1, 1)),
            LightPoint
                .fromIntensityAndPos(60000, Coords.fromXYZ(200, -200, -300)),
        ]);
    }
    static demo_MaterialEyeball() {
        /*
        var imageEyeball = new ImageFromStrings
        (
            "ImageEyeball",
            [
                "k","b","w","w","w","w","w","w","w","w"
            ]
        );
        */
        var imageEyeball = ImageFromDataUrl.fromNameAndDataUrl("ImageEyeball", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAICAYAAAA4GpVBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZSURBVBhXYwCC/0wMi14AKSBgAvExCQYGAMRUBpJwU7r/AAAAAElFTkSuQmCC");
        var materialEyeball = new Material("MaterialEyeball", Color.Instances().White, 1, // diffuse
        1, // specular
        .2, // shininess
        10, // diffuse
        new Texture("TextureEyeball", imageEyeball));
        return materialEyeball;
    }
    static demo_MaterialRTBang() {
        var imageRTBang = new ImageFromStrings("RTBang", [
            "RRRRRRRRRRRRRRRR",
            "RRcccccRcccccRcR",
            "RRcRRRcRRRcRRRcR",
            "RRcRRRcRRRcRRRcR",
            "RRcccccRRRcRRRcR",
            "RRcRRcRRRRcRRRRR",
            "RRcRRRcRRRcRRRcR",
            "RRRRRRRRRRRRRRRR",
        ]);
        var materialRTBang = new Material("RTBang", Color.Instances().White, 1, // ambient
        1, // diffuse
        .2, // specular
        10, // shininess
        Texture.fromNameAndImage("RTBang", imageRTBang));
        return materialRTBang;
    }
    static demo_MeshGround(materialGround) {
        var meshGround = new Mesh("Ground", 
        // vertices
        [
            Vertex.fromPos(Coords.fromXY(-1000, -1000)),
            Vertex.fromPos(Coords.fromXY(1000, -1000)),
            Vertex.fromPos(Coords.fromXY(1000, 1000)),
            Vertex.fromPos(Coords.fromXY(-1000, 1000)),
        ], 
        // faces
        [
            Face.fromMaterialNameAndVertexIndices(materialGround.name, [3, 2, 1, 0])
        ]);
        return meshGround;
    }
    static demo_MeshMonolith(materialRTBang) {
        var meshMonolith = MeshHelper.transformMeshVertexPositions(MeshHelper.buildCubeUnit("Monolith", materialRTBang), new TransformMultiple([
            new TransformScale(Coords.fromXYZ(40, 10, 90)),
            new TransformTranslate(Coords.fromXYZ(0, 0, -90)),
        ]));
        return meshMonolith;
    }
    static demo_SphereEyeball(materialEyeball) {
        var sphereEyeball = new Sphere("SphereEyeball", materialEyeball.name, 100, // radius
        Coords.fromXYZ(200, 200, -270), // center
        Orientation.fromForwardAndDown(Coords.fromXYZ(1, 0, 0), Coords.fromXYZ(1, 1, 0) // down = SE
        ));
        return sphereEyeball;
    }
    static demoWithProjectionParallel() {
        var camera = this.demo_Camera(true);
        return this.demo(camera);
    }
    static demoWithProjectionPerspective() {
        var camera = this.demo_Camera(false);
        return this.demo(camera);
    }
    collisionsOfRayWithObjectsMinusExceptionAddToList(ray, shapeToExcept, collisionsSoFar) {
        var shapes = this.shapes();
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape != shapeToExcept) {
                shape.addCollisionsWithRayToList(ray, collisionsSoFar);
            }
        }
        return collisionsSoFar;
    }
    loadForRendererAndSendToCallback(sceneRenderer, callback) {
        if (sceneRenderer.texturesAreEnabled) {
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
        else {
            callback(this);
        }
    }
    materialByName(name) {
        if (this._materialsByName == null) {
            this._materialsByName = new Map(this.materials.map(x => [x.name, x]));
        }
        return this._materialsByName.get(name);
    }
    shapeDefinitionByName(name) {
        return this.shapeDefinitions.find(x => x.name == name);
    }
    shapes() {
        if (this._shapes == null) {
            this._shapes = this.shapeBuilders.map(x => x.toShape(this));
        }
        return this._shapes;
    }
    // Serializable.
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        this.materials.forEach(x => typeSetOnObject(Material, x));
        typeSetOnObject(Color, this.backgroundColor);
        typeSetOnObject(Lighting, this.lighting);
        typeSetOnObject(Camera, this.camera);
        this.shapeDefinitions.forEach(x => ShapeHelper.typeSetOnShape(x));
        this.shapeBuilders.forEach(x => Object.setPrototypeOf(x, ShapeBuilder.prototype));
        return this;
    }
    fromJson(objectAsJson) {
        var scene;
        try {
            scene = SerializableHelper.objectOfTypeFromJson(Scene, objectAsJson);
        }
        catch (err) {
            console.log("Error deserializing scene.");
        }
        return scene;
    }
    static fromJson(objectAsJson) {
        return Scene.create().fromJson(objectAsJson);
    }
    toJson() {
        Scene.temporaryFieldsRemoveFromObjectAndDescendants(this, 0);
        var sceneAsJson = JSON.stringify(this, null, 4);
        return sceneAsJson;
    }
    static temporaryFieldsRemoveFromObjectAndDescendants(objectToRemoveFrom, depth) {
        for (var fieldName in objectToRemoveFrom) {
            if (fieldName.startsWith("_")) {
                delete objectToRemoveFrom[fieldName];
            }
            else {
                var fieldValue = objectToRemoveFrom[fieldName];
                if (fieldValue != null) {
                    var fieldTypeName = fieldValue.constructor.name;
                    var fieldTypeIsPrimitive = (fieldTypeName == String.name);
                    if (fieldTypeIsPrimitive == false) {
                        Scene.temporaryFieldsRemoveFromObjectAndDescendants(fieldValue, depth + 1);
                    }
                }
            }
        }
    }
}
