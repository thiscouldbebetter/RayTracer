
class TransformOrient implements Transform
{
	orientation: Orientation;

	constructor(orientation: Orientation)
	{
		this.orientation = orientation;
	}

	static fromOrientation(orientation: Orientation): TransformOrient
	{
		return new TransformOrient(orientation);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		var ori = this.orientation;
		coordsToTransform.overwriteWithXYZ
		(
			ori.forward.dotProduct(coordsToTransform),
			ori.right.dotProduct(coordsToTransform),
			ori.down.dotProduct(coordsToTransform)
		);

		return coordsToTransform;
	}
}
