
class TransformOrient
{
	constructor(orientation)
	{
		this.orientation = orientation;
	}

	transformCoords(coordsToTransform)
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
