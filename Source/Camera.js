"use strict";
class Camera {
    constructor(viewSize, focalLength, pos, orientation) {
        this.viewSize = viewSize;
        this.focalLength = focalLength;
        this.pos = pos;
        this.orientation = orientation;
    }
    displacementToPixelAtPos(pixelPos) {
        if (this._displacementToPixel == null) {
            this._displacementToPixel = Coords.create();
        }
        var displacementToPixel = this._displacementToPixel;
        var cameraOrientation = this.orientation;
        var cameraOrientationTemp = Orientation.Instances().Camera;
        var cameraForward = cameraOrientationTemp.forward;
        var cameraRight = cameraOrientationTemp.right;
        var cameraDown = cameraOrientationTemp.down;
        var displaySizeInPixelsHalf = this.viewSizeHalf();
        if (this.focalLength == null) {
            // Parallel projection.
            displacementToPixel
                .overwriteWith(cameraOrientation.forward);
        }
        else {
            // Perspective projection.
            displacementToPixel.overwriteWith(cameraRight
                .overwriteWith(cameraOrientation.right)
                .multiplyScalar(pixelPos.x - displaySizeInPixelsHalf.x)).add(cameraDown
                .overwriteWith(cameraOrientation.down)
                .multiplyScalar(pixelPos.y - displaySizeInPixelsHalf.y)).add(cameraForward
                .overwriteWith(cameraOrientation.forward)
                .multiplyScalar(this.focalLength));
        }
        return displacementToPixel;
    }
    directionToPixelAtPos(pixelPos) {
        if (this._directionToPixel == null) {
            this._directionToPixel = Coords.create();
        }
        var displacementToPixel = this.displacementToPixelAtPos(pixelPos);
        var directionToPixel = this._directionToPixel;
        directionToPixel
            .overwriteWith(displacementToPixel)
            .normalize();
        return directionToPixel;
    }
    viewSizeHalf() {
        if (this._viewSizeHalf == null) {
            this._viewSizeHalf = this.viewSize.clone().half();
        }
        return this._viewSizeHalf;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Coords, this.viewSize);
        typeSetOnObject(Coords, this.pos);
        typeSetOnObject(Orientation, this.orientation);
        return this;
    }
}
