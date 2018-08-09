
// classes

function Bounds(min, max)
{
	this.min = min;
	this.max = max;
	this.minAndMax = [ this.min, this.max ];
	this.size = new Coords();

	this.recalculateDerivedValues();
}

{	
	Bounds.prototype.overlapsWith = function(other)
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

			if (doAllDimensionsOverlapSoFar == true)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
	}

	Bounds.prototype.recalculateDerivedValues = function()
	{
		this.size.overwriteWith(this.max).subtract(this.min);
	}
}
