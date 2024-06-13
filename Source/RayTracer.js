"use strict";
class RayTracer {
    sceneRender(scene) {
        this.scene = scene;
        var displaySize = this.scene.camera.viewSize;
        this.display = new Display();
        this.display.initialize(displaySize);
        var timeBeforeRender = new Date();
        this.scene.loadAndSendToCallback((sceneLoaded) => {
            sceneLoaded.drawToDisplay(this.display);
            var timeAfterRender = new Date();
            var renderTimeInMilliseconds = timeAfterRender.valueOf()
                - timeBeforeRender.valueOf();
            console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
        });
    }
}
