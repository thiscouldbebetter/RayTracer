
class TransformOrient implements Transform
{
	orientation: Orientation;

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;
	}

	transformCoords(coordsToTransform: Coords): Coords
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
