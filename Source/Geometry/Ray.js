"use strict";
class Ray {
    constructor(startPos, direction) {
        this.startPos = startPos;
        this.direction = direction;
    }
    static create() {
        return new Ray(Coords.create(), Coords.create());
    }
    static fromStartPosAndDirection(startPos, direction) {
        return new Ray(startPos, direction);
    }
    startPosAndDirectionSet(startPos, direction) {
        this.startPos.overwriteWith(startPos);
        this.direction.overwriteWith(direction);
        return this;
    }
}
