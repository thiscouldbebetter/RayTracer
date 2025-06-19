
class TransformScale implements Transform
{
	scaleFactors: Coords;

	constructor(scaleFactors: Coords)
	{
		this.scaleFactors = scaleFactors;
	}

	static fromScaleFactors(scaleFactors: Coords)
	{
		return new TransformScale(scaleFactors);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		coordsToTransform.multiply(this.scaleFactors);

		return coordsToTransform;
	}

}
