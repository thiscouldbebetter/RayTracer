
function TransformOrient(orientation)
{
	this.orientation = orientation;
}

{
	TransformOrient.prototype.transformCoords = function(coordsToTransform)
	{
		coordsToTransform.overwriteWithXYZ
		(
			this.orientation.forward.dotProduct(coordsToTransform),
			this.orientation.right.dotProduct(coordsToTransform),
			this.orientation.down.dotProduct(coordsToTransform)
		);

		return coordsToTransform;
	}
}
