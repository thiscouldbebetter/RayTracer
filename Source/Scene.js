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
    drawToDisplay(display) {
        this.drawToDisplay_InitializeTemporaryVariables();
        this.drawToDisplay_Background(display);
        var sizeInTiles = Coords.fromXY(1, 1);
        var tileSizeInPixels = display.sizeInPixels.clone().divide(sizeInTiles);
        var tilePosInTiles = Coords.create();
        var tileBounds = new Bounds(Coords.create(), Coords.create());
        for (var y = 0; y < sizeInTiles.y; y++) {
            tilePosInTiles.y = y;
            for (var x = 0; x < sizeInTiles.x; x++) {
                tilePosInTiles.x = x;
                tileBounds.min.overwriteWith(tilePosInTiles).multiply(tileSizeInPixels);
                tileBounds.max.overwriteWith(tileBounds.min).add(tileSizeInPixels);
                this.drawToDisplay_PixelsGetAndDrawForBounds(display, tileBounds);
            }
        }
    }
    drawToDisplay_InitializeTemporaryVariables() {
        this.Collisions = [];
        this.DirectionFromEyeToPixel = Coords.create();
        this.DisplacementFromEyeToPixel = Coords.create();
        this.Material = Material.fromNameAndColor("DisplayMaterial", Color.blank("MaterialColor"));
        this.PixelColor = Color.blank("PixelColor");
        this.SurfaceNormal = Coords.create();
        this.TexelColor = Color.blank("TexelColor");
        this.TexelUV = Coords.create();
        this.VertexWeightsAtSurfacePos = [];
    }
    drawToDisplay_Background(display) {
        display.fillWithColor(this.backgroundColor);
    }
    drawToDisplay_PixelsGetAndDrawForBounds(display, bounds) {
        // todo
        // It's currently impossible to use DOM objects,
        // including Canvas and GraphicsContext objects,
        // within a web worker. Hopefully this will 
        // change in the future.
        var pixelPos = Coords.create();
        var pixelColor = this.PixelColor;
        var boundsMin = bounds.min;
        var boundsMax = bounds.max;
        var sceneBackgroundColor = this.backgroundColor;
        for (var y = boundsMin.y; y < boundsMax.y; y++) {
            pixelPos.y = y;
            for (var x = boundsMin.x; x < boundsMax.x; x++) {
                pixelPos.x = x;
                var collisionForRayFromCameraToPixel = this.drawToDisplay_ColorSetFromPixelAtPos(display, pixelColor, pixelPos);
                if (collisionForRayFromCameraToPixel == null) {
                    pixelColor.overwriteWith(sceneBackgroundColor);
                }
                display.pixelAtPosSetToColor(pixelPos, pixelColor);
            }
        }
    }
    drawToDisplay_ColorSetFromPixelAtPos(display, surfaceColor, pixelPos) {
        var collisionClosest = this.drawToDisplay_Pixel_FindClosestCollision(display, pixelPos);
        if (collisionClosest != null) {
            var collidable = collisionClosest.colliderByName("Collidable");
            var surfaceNormal = this.SurfaceNormal;
            var surfaceMaterial = this.Material;
            collidable.surfaceMaterialColorAndNormalForCollision(this, collisionClosest, surfaceMaterial, surfaceColor, surfaceNormal);
            var intensityFromLightsAll = 0;
            var lights = this.lighting.lights;
            for (var i = 0; i < lights.length; i++) {
                var light = lights[i];
                var intensity = light.intensityForCollisionMaterialNormalAndCamera(collisionClosest, surfaceMaterial, surfaceNormal, this.camera);
                intensityFromLightsAll += intensity;
            }
            surfaceColor.multiply(intensityFromLightsAll);
        }
        return collisionClosest;
    }
    drawToDisplay_Pixel_FindClosestCollision(display, pixelPos) {
        var camera = this.camera;
        var cameraOrientation = camera.orientation;
        var displacementFromEyeToPixel = this.DisplacementFromEyeToPixel;
        var cameraOrientationTemp = Orientation.Instances().Camera;
        var cameraForward = cameraOrientationTemp.forward;
        var cameraRight = cameraOrientationTemp.right;
        var cameraDown = cameraOrientationTemp.down;
        var displaySizeInPixelsHalf = display.sizeInPixelsHalf;
        displacementFromEyeToPixel.overwriteWith(cameraForward.overwriteWith(cameraOrientation.forward).multiplyScalar(camera.focalLength)).add(cameraRight.overwriteWith(cameraOrientation.right).multiplyScalar(pixelPos.x - displaySizeInPixelsHalf.x)).add(cameraDown.overwriteWith(cameraOrientation.down).multiplyScalar(pixelPos.y - displaySizeInPixelsHalf.y));
        var directionFromEyeToPixel = this.DirectionFromEyeToPixel;
        directionFromEyeToPixel.overwriteWith(displacementFromEyeToPixel).normalize();
        var rayFromEyeToPixel = new Ray(camera.pos, directionFromEyeToPixel);
        var collisions = this.Collisions;
        collisions.length = 0;
        var collidables = this.collidables;
        for (var i = 0; i < collidables.length; i++) {
            var collidable = collidables[i];
            collidable.addCollisionsWithRayToList(rayFromEyeToPixel, collisions);
        }
        var collisionClosest = null;
        if (collisions.length > 0) {
            collisionClosest = collisions[0];
            for (var c = 1; c < collisions.length; c++) {
                var collision = collisions[c];
                if (collision.distanceToCollision < collisionClosest.distanceToCollision) {
                    collisionClosest = collision;
                }
            }
        }
        return collisionClosest;
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
        var sceneAsJson = JSON.stringify(this, null, 4);
        return sceneAsJson;
    }
}
