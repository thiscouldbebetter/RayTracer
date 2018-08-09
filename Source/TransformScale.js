
function TransformScale(scaleFactors)
{
	this.scaleFactors = scaleFactors;
}

{
	TransformScale.prototype.transformCoords = function(coordsToTransform)
	{
		coordsToTransform.multiply(this.scaleFactors);

		return coordsToTransform;
	}

}
