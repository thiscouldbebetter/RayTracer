"use strict";
class RayTracer {
    sceneRender(scene) {
        this.scene = scene;
        var displaySize = this.scene.camera.viewSize;
        this.display = new Display();
        this.display.initialize(displaySize);
        var timeBeforeRender = new Date();
        var sceneRenderer = SceneRenderer.maximal(); // todo - Make configurable through UI.
        this.scene.loadForRendererAndSendToCallback(sceneRenderer, (sceneLoaded) => {
            this.scene = sceneLoaded;
            sceneRenderer.drawSceneToDisplay(this.scene, this.display);
            var timeAfterRender = new Date();
            var renderTimeInMilliseconds = timeAfterRender.valueOf()
                - timeBeforeRender.valueOf();
            console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
        });
    }
}
