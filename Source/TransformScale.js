
class TransformScale
{
	constructor(scaleFactors)
	{
		this.scaleFactors = scaleFactors;
	}

	transformCoords(coordsToTransform)
	{
		coordsToTransform.multiply(this.scaleFactors);

		return coordsToTransform;
	}

}
