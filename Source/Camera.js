"use strict";
class Camera {
    constructor(viewSize, focalLength, pos, orientation) {
        this.viewSize = viewSize;
        this.focalLength = focalLength;
        this.pos = pos;
        this.orientation = orientation;
        this._viewSizeHalf = this.viewSize.clone().half();
    }
    viewSizeHalf() {
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
