"use strict";
class CollisionGroup {
    constructor(collisions) {
        this.collisions = collisions;
    }
    static create() {
        return new CollisionGroup([]);
    }
    clear() {
        this.collisions.length = 0;
        return this;
    }
    collisionAdd(collisionToAdd) {
        this.collisions.push(collisionToAdd);
        return this;
    }
    collisionClosest() {
        return Collision.closestOf(this.collisions);
    }
    hasCollisions() {
        return (this.collisions.length > 0);
    }
}
