"use strict";
class Coords {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static create() {
        return new Coords(0, 0, 0);
    }
    static fromXY(x, y) {
        return new Coords(x, y, 0);
    }
    // instance methods
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    clone() {
        return new Coords(this.x, this.y, this.z);
    }
    crossProduct(other) {
        this.overwriteWithXYZ(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
        return this;
    }
    dimension(dimensionIndex) {
        return (dimensionIndex == 0 ? this.x : dimensionIndex == 1 ? this.y : this.z);
    }
    dimensionValues() {
        return [this.x, this.y, this.z];
    }
    divide(other) {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }
    divideScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }
    dotProduct(other) {
        var returnValue = this.x * other.x
            + this.y * other.y
            + this.z * other.z;
        return returnValue;
    }
    half() {
        return this.divideScalar(2);
    }
    invert() {
        return this.multiplyScalar(-1);
    }
    magnitude() {
        var returnValue = Math.sqrt(this.x * this.x
            + this.y * this.y
            + this.z * this.z);
        return returnValue;
    }
    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    normalize() {
        return this.divideScalar(this.magnitude());
    }
    overwriteWith(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    overwriteWithXYZ(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    toString() {
        var returnValue = "(" + this.x + "," + this.y + "," + this.z + ")";
        return returnValue;
    }
    trimToRange(range) {
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x > range.x) {
            this.x = range.x;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        else if (this.y > range.y) {
            this.y = range.y;
        }
        if (this.z < 0) {
            this.z = 0;
        }
        else if (this.z > range.z) {
            this.z = range.z;
        }
        return this;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        return this;
    }
}
// constants
Coords.NumberOfDimensions = 3;
