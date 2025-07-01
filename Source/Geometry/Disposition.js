"use strict";
class Disposition {
    constructor(pos, ori) {
        this.pos = pos;
        this.ori = ori;
    }
    static fromPos(pos) {
        return new Disposition(pos, Orientation.default());
    }
    static fromPosAndOri(pos, ori) {
        return new Disposition(pos, ori);
    }
    // Clonable.
    clone() {
        return new Disposition(this.pos.clone(), this.ori.clone());
    }
    // Serializable.
    fromJson() {
        throw new Error("Not yet implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Coords, this.pos);
        typeSetOnObject(Orientation, this.ori);
        return this;
    }
    toJson() {
        throw new Error("Not yet implemented!");
    }
    toObjectSerializable() {
        return this;
    }
}
