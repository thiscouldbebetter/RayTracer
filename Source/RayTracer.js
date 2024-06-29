"use strict";
class RayTracer {
    sceneRender(scene) {
        this.scene = scene;
        var displaySize = this.scene.camera.viewSize;
        this.display = new Display();
        this.display.initialize(displaySize);
        var timeBeforeRender = new Date();
        this.scene.loadAndSendToCallback((sceneLoaded) => {
            this.scene = sceneLoaded;
            var sceneRenderer = new SceneRenderer();
            sceneRenderer.drawSceneToDisplay(this.scene, this.display);
            var timeAfterRender = new Date();
            var renderTimeInMilliseconds = timeAfterRender.valueOf()
                - timeBeforeRender.valueOf();
            console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
        });
    }
}
