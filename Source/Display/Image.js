"use strict";
class Image2 {
    constructor(name, imageDataAsStrings) {
        this.name = name;
        this.imageDataAsStrings = imageDataAsStrings;
        this.sizeInPixels = Coords.fromXY(this.imageDataAsStrings[0].length, this.imageDataAsStrings.length);
    }
    imageData() {
        if (this._imageData == null) {
            this._imageData =
                this.imageDataBuildFromStrings(this.imageDataAsStrings);
        }
        return this._imageData;
    }
    imageDataBuildFromStrings(stringsForPixels) {
        var sizeInPixels = Coords.fromXY(stringsForPixels[0].length, stringsForPixels.length);
        var d = document;
        var canvas = d.createElement("canvas");
        canvas.width = sizeInPixels.x;
        canvas.height = sizeInPixels.y;
        var graphics = canvas.getContext("2d");
        var pixelPos = Coords.create();
        var colorForPixel = Color.Instances().Transparent;
        for (var y = 0; y < sizeInPixels.y; y++) {
            var stringForPixelRow = stringsForPixels[y];
            for (var x = 0; x < sizeInPixels.x; x++) {
                var charForPixel = stringForPixelRow[x];
                colorForPixel = Color.byCodeChar(charForPixel);
                graphics.fillStyle = colorForPixel.systemColor();
                graphics.fillRect(pixelPos.x, pixelPos.y, 1, 1);
            }
        }
        var imageData = graphics.getImageData(0, 0, sizeInPixels.x, sizeInPixels.y);
        return imageData;
    }
    systemImageSendToCallback(callback) {
        if (this._systemImage != null) {
            callback(this._systemImage);
        }
        else {
            var canvas = document.createElement("canvas");
            canvas.width = this.sizeInPixels.x;
            canvas.height = this.sizeInPixels.y;
            var graphics = canvas.getContext("2d");
            var imageData = this.imageData();
            graphics.putImageData(imageData, 0, 0);
            var imageFromCanvasURL = canvas.toDataURL("image/png");
            var systemImage = document.createElement("img");
            systemImage.width = canvas.width;
            systemImage.height = canvas.height;
            systemImage.onload = (event) => {
                var imgElement = event.target;
                imgElement.isLoaded = true;
                callback(imgElement);
            };
            systemImage.src = imageFromCanvasURL;
            this._systemImage = systemImage;
        }
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        Object.setPrototypeOf(this.imageData, ImageData.prototype);
        return this;
    }
}
