"use strict";
class Globals {
    initialize(scene) {
        this.scene = scene;
        var displaySize = this.scene.camera.viewSize;
        this.display = new Display();
        this.display.initialize(displaySize);
        this.scene.loadAndSendToCallback((sceneLoaded) => this.display.drawScene(sceneLoaded));
    }
}
Globals.Instance = new Globals();
