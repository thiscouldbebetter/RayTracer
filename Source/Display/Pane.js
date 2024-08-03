"use strict";
class Pane {
    constructor(boundsMin, boundsMax) {
        this.boundsMin = boundsMin;
        this.boundsMax = boundsMax;
        this.sizeInPixels =
            this.boundsMax.clone().subtract(this.boundsMin);
        this._pixelPosAbsolute = Coords.create();
        this._pixelPosRelative = Coords.create();
        this.pixelRows = [];
        var size = this.sizeInPixels;
        for (var y = 0; y < size.y; y++) {
            var pixelRow = [];
            for (var x = 0; x < size.x; x++) {
                pixelRow[x] = Color.create();
            }
            this.pixelRows.push(pixelRow);
        }
    }
    drawToDisplay(display) {
        var pixelPosRelative = this._pixelPosRelative;
        var pixelPosAbsolute = this._pixelPosAbsolute;
        for (var y = 0; y < this.sizeInPixels.y; y++) {
            pixelPosRelative.y = y;
            var pixelRow = this.pixelRows[y];
            for (var x = 0; x < this.sizeInPixels.x; x++) {
                pixelPosRelative.x = x;
                pixelPosAbsolute
                    .overwriteWith(pixelPosRelative)
                    .add(this.boundsMin);
                var pixelColor = pixelRow[x];
                display.pixelAtPosSetToColor(pixelPosAbsolute, pixelColor);
            }
        }
    }
    pixelAtPosRelativeSetToColor(posRelative, color) {
        this.pixelRows[posRelative.y][posRelative.x].overwriteWith(color);
    }
}
