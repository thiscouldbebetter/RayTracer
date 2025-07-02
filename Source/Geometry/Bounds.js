"use strict";
class Bounds {
    constructor(min, max) {
        this.min = min || Coords.create();
        this.max = max || Coords.create();
        this.minAndMax = [this.min, this.max];
        this.recalculateDerivedValues();
    }
    static create() {
        return new Bounds(null, null);
    }
    static fromMinAndMax(min, max) {
        return new Bounds(min, max);
    }
    static ofPoints(points) {
        var point0 = points[0];
        var minSoFar = point0.clone();
        var maxSoFar = point0.clone();
        for (var p = 1; p < points.length; p++) {
            var point = points[p];
            for (var d = 0; d < Coords.NumberOfDimensions; d++) {
                var pointDimension = point.dimension(d);
                var minDimension = minSoFar.dimension(d);
                if (pointDimension < minDimension) {
                    minSoFar.dimensionSet(d, pointDimension);
                }
                var maxDimension = maxSoFar.dimension(d);
                if (pointDimension > maxDimension) {
                    maxSoFar.dimensionSet(d, pointDimension);
                }
            }
        }
        var bounds = Bounds.fromMinAndMax(minSoFar, maxSoFar);
        return bounds;
    }
    overlapsWith(other) {
        var returnValue = false;
        var bounds = [this, other];
        for (var b = 0; b < bounds.length; b++) {
            var boundsThis = bounds[b];
            var boundsOther = bounds[1 - b];
            var doAllDimensionsOverlapSoFar = true;
            for (var d = 0; d < Coords.NumberOfDimensions; d++) {
                if (boundsThis.max.dimension(d) <= boundsOther.min.dimension(d)
                    || boundsThis.min.dimension(d) >= boundsOther.max.dimension(d)) {
                    doAllDimensionsOverlapSoFar = false;
                    break;
                }
            }
            if (doAllDimensionsOverlapSoFar) {
                returnValue = true;
                break;
            }
        }
        return returnValue;
    }
    recalculateDerivedValues() {
        this._size = null;
    }
    size() {
        if (this._size == null) {
            this._size = this.max.clone().subtract(this.min);
        }
        return this._size;
    }
}
