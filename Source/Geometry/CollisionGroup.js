"use strict";
class CollisionGroup {
    constructor(collisions) {
        this._collisions = collisions;
    }
    static create() {
        return new CollisionGroup([]);
    }
    clear() {
        for (var i = 0; i < this._collisions.length; i++) {
            var collision = this._collisions[i];
            if (collision.deactivated) {
                break;
            }
            else {
                collision.deactivate();
            }
        }
        return this;
    }
    collisionAdd(collisionToAdd) {
        var i = 0;
        for (i = 0; i < this._collisions.length; i++) {
            var collisionInPlace = this._collisions[i];
            if (collisionInPlace.deactivated) {
                collisionInPlace
                    .overwriteWith(collisionToAdd)
                    .activate();
                break;
            }
        }
        if (i >= this._collisions.length) {
            this._collisions.push(collisionToAdd.clone());
        }
        return this;
    }
    collisionClosest() {
        var collision0 = Collision.closestOfActivated(this._collisions);
        return collision0;
    }
    collisions() {
        return this._collisions;
    }
    hasCollisions() {
        var returnValue = this._collisions.length > 0
            && this._collisions[0].deactivated == false;
        return returnValue;
    }
}
