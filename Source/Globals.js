"use strict";
class Globals {
    initialize(scene) {
        this.scene = scene;
        var displaySize = this.scene.camera.viewSize;
        this.display = new Display();
        this.display.initialize(displaySize);
        var timeBeforeRender = new Date();
        this.scene.loadAndSendToCallback((sceneLoaded) => {
            this.display.drawScene(sceneLoaded);
            var timeAfterRender = new Date();
            var renderTimeInMilliseconds = timeAfterRender.valueOf()
                - timeBeforeRender.valueOf();
            console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
        });
    }
}
Globals.Instance = new Globals();
