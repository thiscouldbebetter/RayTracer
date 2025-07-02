"use strict";
class Pane {
    constructor(bounds) {
        this.bounds = bounds;
        this._pixelColor = Color.create();
        this._pixelPosAbsolute = Coords.create();
        this._pixelPosRelative = Coords.create();
        this.pixelRows = [];
        var size = this.sizeInPixels();
        for (var y = 0; y < size.y; y++) {
            var pixelRow = [];
            for (var x = 0; x < size.x; x++) {
                pixelRow[x] = Color.create();
            }
            this.pixelRows.push(pixelRow);
        }
    }
    static fromBounds(bounds) {
        return new Pane(bounds);
    }
    drawToDisplay(display) {
        var pixelPosRelative = this._pixelPosRelative;
        var pixelPosAbsolute = this._pixelPosAbsolute;
        var sizeInPixels = this.sizeInPixels();
        for (var y = 0; y < sizeInPixels.y; y++) {
            pixelPosRelative.y = y;
            var pixelRow = this.pixelRows[y];
            for (var x = 0; x < sizeInPixels.x; x++) {
                pixelPosRelative.x = x;
                pixelPosAbsolute
                    .overwriteWith(pixelPosRelative)
                    .add(this.bounds.min);
                var pixelColor = pixelRow[x];
                display.pixelAtPosSetToColor(pixelPosAbsolute, pixelColor);
            }
        }
    }
    pixelAtPosRelativeSetToColor(posRelative, color) {
        var pixelAsColor = this.pixelRows[posRelative.y][posRelative.x];
        pixelAsColor.overwriteWith(color);
    }
    sceneDrawForRenderer(scene, sceneRenderer) {
        var paneSize = this.sizeInPixels();
        var pixelPosRelative = this._pixelPosRelative;
        for (var y = 0; y < paneSize.y; y++) {
            pixelPosRelative.y = y;
            for (var x = 0; x < paneSize.x; x++) {
                pixelPosRelative.x = x;
                sceneRenderer.sceneDrawToPaneAtPixelPosRelative(scene, this, pixelPosRelative);
            }
        }
    }
    sizeInPixels() {
        return this.bounds.size();
    }
}
