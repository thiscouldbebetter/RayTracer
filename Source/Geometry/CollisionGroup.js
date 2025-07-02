"use strict";
class CollisionGroup {
    constructor(collisions) {
        this._collisions = collisions;
    }
    static create() {
        return new CollisionGroup([]);
    }
    clear() {
        this._collisions.length = 0;
        return this;
    }
    collisionAdd(collisionToAdd) {
        var i = 0;
        for (i = 0; i < this._collisions.length; i++) {
            var collisionInPlace = this._collisions[i];
            var shouldBreak = (collisionToAdd.distanceToCollision
                <= collisionInPlace.distanceToCollision);
            if (shouldBreak) {
                break;
            }
        }
        this._collisions.splice(i, 0, collisionToAdd);
        return this;
    }
    collisionClosest() {
        return this._collisions[0]; // Collision.closestOf(this.collisions);
    }
    collisions() {
        return this._collisions;
    }
    hasCollisions() {
        return (this._collisions.length > 0);
    }
}
