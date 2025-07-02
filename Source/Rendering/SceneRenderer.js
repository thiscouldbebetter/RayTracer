"use strict";
class SceneRenderer {
    constructor(lightingIsEnabled, shadowsAreEnabled, texturesAreEnabled, transparencyIsEnabled, renderToBufferFirst) {
        this.lightingIsEnabled = lightingIsEnabled;
        this.shadowsAreEnabled = shadowsAreEnabled;
        this.texturesAreEnabled = texturesAreEnabled;
        this.transparencyIsEnabled = transparencyIsEnabled;
        this.renderToBufferFirst = renderToBufferFirst;
        this._collisionGroup = CollisionGroup.create();
    }
    static minimal() {
        return new SceneRenderer(false, false, false, false, false);
    }
    static maximal() {
        return new SceneRenderer(true, true, true, true, false); // todo - Enable renderToBufferFirst.
    }
    sceneRender(scene) {
        var displaySize = scene.camera.viewSize;
        var displayToRenderToFirst = this.renderToBufferFirst
            ? new DisplayBuffer(displaySize)
            : new DisplayGraphics(displaySize);
        var timeBeforeRender = new Date();
        scene.loadForRendererAndSendToCallback(this, (sceneLoaded) => {
            this.sceneRender_SceneLoaded(sceneLoaded, this, // sceneRender
            displayToRenderToFirst, timeBeforeRender);
        });
    }
    sceneRender_SceneLoaded(sceneLoaded, sceneRenderer, displayToRenderToFirst, timeBeforeRender) {
        sceneRenderer.sceneDrawToDisplay(sceneLoaded, displayToRenderToFirst);
        if (this.renderToBufferFirst) {
            var displayFinal = new DisplayGraphics(sceneLoaded.camera.viewSize);
            displayToRenderToFirst.drawToOther(displayFinal);
        }
        var timeAfterRender = new Date();
        var renderTimeInMilliseconds = timeAfterRender.valueOf()
            - timeBeforeRender.valueOf();
        console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
    }
    sceneDrawToDisplay(scene, display) {
        this.sceneDrawToDisplay_InitializeTemporaryVariables();
        this.sceneDrawToDisplay_Background(scene, display);
        var sizeInTiles = Coords.fromXY(1, 1);
        var tileSizeInPixels = display.sizeInPixels
            .clone()
            .divide(sizeInTiles);
        var tilePosInTiles = Coords.create();
        var tileBounds = Bounds.create();
        for (var y = 0; y < sizeInTiles.y; y++) {
            tilePosInTiles.y = y;
            for (var x = 0; x < sizeInTiles.x; x++) {
                tilePosInTiles.x = x;
                this.sceneDrawToDisplay_ForTilePosAndBounds(scene, display, tileSizeInPixels, tilePosInTiles, tileBounds);
            }
        }
    }
    sceneDrawToDisplay_ForTilePosAndBounds(scene, display, tileSizeInPixels, tilePosInTiles, tileBounds) {
        tileBounds.min
            .overwriteWith(tilePosInTiles)
            .multiply(tileSizeInPixels);
        tileBounds.max
            .overwriteWith(tileBounds.min)
            .add(tileSizeInPixels);
        this.sceneDrawToDisplay_PixelsGetAndDrawForBounds(scene, display, tileBounds);
    }
    sceneDrawToDisplay_InitializeTemporaryVariables() {
        this._collisions = [];
        this._directionFromEyeToPixel = Coords.create();
        this._displacementFromEyeToPixel = Coords.create();
        this._pixelColor = Color.blank("PixelColor");
        this._pixelPosAbsolute = Coords.create();
        this._texelColor = Color.blank("TexelColor");
        this._texelUV = Coords.create();
        this._vertexWeightsAtSurfacePos = [];
    }
    sceneDrawToDisplay_Background(scene, display) {
        display.fillWithColor(scene.backgroundColor);
    }
    sceneDrawToDisplay_PixelsGetAndDrawForBounds(scene, display, bounds) {
        var pane = Pane.fromBounds(bounds);
        pane.sceneDrawForRenderer(scene, this);
        pane.drawToDisplay(display);
    }
    sceneDrawToPaneAtPixelPosRelative(scene, pane, pixelPosRelativeToPane) {
        var pixelPosAbsolute = this._pixelPosAbsolute
            .overwriteWith(pixelPosRelativeToPane)
            .add(pane.bounds.min);
        var collisionGroup = this.collisionsFindOfSceneWithRayFromCameraToPixelPos(scene, pixelPosAbsolute);
        if (collisionGroup.hasCollisions()) // todo - Iterate.
         {
            var collision = collisionGroup.collisionClosest();
            var shape = collision.shapeCollidingFinal();
            shape.surfaceMaterialColorAndNormalForCollision(scene, collision);
            var intensityFromLightsAll = this.intensityFromLightsAll(collision, scene);
            var pixelColor = this._pixelColor
                .overwriteWith(collision.surfaceColor)
                .multiply(intensityFromLightsAll);
            pane.pixelAtPosRelativeSetToColor(pixelPosRelativeToPane, pixelColor);
        }
    }
    collisionsFindOfSceneWithRayFromCameraToPixelPos(scene, pixelPos) {
        var camera = scene.camera;
        var rayFromCameraToPixel = camera.rayToPixelAtPos(pixelPos);
        var collisionGroup = this._collisionGroup;
        collisionGroup.clear();
        collisionGroup = scene.collisionsOfRayWithObjectsMinusExceptionAddToGroup(rayFromCameraToPixel, null, // objectToExcept
        collisionGroup);
        return collisionGroup;
    }
    intensityFromLightsAll(collision, scene) {
        var intensityFromLightsAll = 0;
        if (this.lightingIsEnabled == false) {
            intensityFromLightsAll = 1;
        }
        else {
            var lights = scene.lighting.lights;
            for (var i = 0; i < lights.length; i++) {
                var light = lights[i];
                var intensity = light.intensityForCollisionAndCamera(collision, scene.camera, this, scene);
                intensityFromLightsAll += intensity;
            }
        }
        return intensityFromLightsAll;
    }
}
