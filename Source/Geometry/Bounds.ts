
class Bounds
{
	min: Coords;
	max: Coords;

	minAndMax: Coords[];
	size: Coords;

	constructor(min: Coords, max: Coords)
	{
		this.min = min || Coords.create();
		this.max = max || Coords.create();

		this.minAndMax = [ this.min, this.max ];
		this.size = Coords.create();

		this.recalculateDerivedValues();
	}

	static create(): Bounds
	{
		return new Bounds(null, null);
	}

	static fromMinAndMax(min: Coords, max: Coords): Bounds
	{
		return new Bounds(min, max);
	}

	static ofPoints(points: Coords[]): Bounds
	{
		var point0 = points[0];
		var minSoFar = point0.clone();
		var maxSoFar = point0.clone();

		for (var p = 1; p < points.length; p++)
		{
			var point = points[p];
			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				var pointDimension = point.dimension(d);

				var minDimension = minSoFar.dimension(d);
				if (pointDimension < minDimension)
				{
					minSoFar.dimensionSet(d, pointDimension);
				}

				var maxDimension = maxSoFar.dimension(d);
				if (pointDimension > maxDimension)
				{
					maxSoFar.dimensionSet(d, pointDimension);
				}
			}
		}

		var bounds = Bounds.fromMinAndMax
		(
			minSoFar, maxSoFar
		);

		return bounds;
	}

	overlapsWith(other: Bounds): boolean
	{
		var returnValue = false;

		var bounds = [ this, other ];

		for (var b = 0; b < bounds.length; b++)
		{
			var boundsThis = bounds[b];
			var boundsOther = bounds[1 - b];

			var doAllDimensionsOverlapSoFar = true;

			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				if 
				(
					boundsThis.max.dimension(d) <= boundsOther.min.dimension(d)
					|| boundsThis.min.dimension(d) >= boundsOther.max.dimension(d)
				)
				{
					doAllDimensionsOverlapSoFar = false;
					break;
				}
			}

			if (doAllDimensionsOverlapSoFar)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
	}

	recalculateDerivedValues(): void
	{
		this.size.overwriteWith(this.max).subtract(this.min);
	}
}
