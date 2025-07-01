"use strict";
class Vertex {
    constructor(pos) {
        this.pos = pos;
    }
    static fromPos(pos) {
        return new Vertex(pos);
    }
    // Clonable.
    clone() {
        return new Vertex(this.pos.clone());
    }
    overwriteWith(other) {
        this.pos.overwriteWith(other.pos);
        return this;
    }
    // strings
    toString() {
        return this.pos.toString();
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Coords, this.pos);
        return this;
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    toObjectSerializable() {
        return this;
    }
}
