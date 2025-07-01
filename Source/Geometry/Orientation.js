"use strict";
class Orientation {
    constructor(forward, down) {
        this.forward = Coords.create();
        this.right = Coords.create();
        this.down = Coords.create();
        this.overwriteWithForwardDown(forward, down);
    }
    static default() {
        return new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1));
    }
    static fromForwardAndDown(forward, down) {
        return new Orientation(forward, down);
    }
    // instance methods
    clone() {
        return new Orientation(this.forward.clone(), this.down.clone());
    }
    overwriteWithForwardDown(forward, down) {
        this.forward.overwriteWith(forward).normalize();
        this.right.overwriteWith(down).crossProduct(this.forward).normalize();
        this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
        return this;
    }
    static Instances() {
        if (Orientation._instances == null) {
            Orientation._instances = new Orientation_Instances();
        }
        return Orientation._instances;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Coords, this.forward);
        typeSetOnObject(Coords, this.right);
        typeSetOnObject(Coords, this.down);
        return this;
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    toObjectSerializable() {
        return this;
    }
}
class Orientation_Instances {
    constructor() {
        this.Camera = new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1));
        this.ForwardXDownZ = new Orientation(new Coords(1, 0, 0), new Coords(0, 0, 1));
        this.ForwardZDownX = new Orientation(new Coords(0, 0, 1), new Coords(1, 0, 0));
    }
}
