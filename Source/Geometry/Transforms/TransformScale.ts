
class TransformScale implements Transform
{
	scaleFactors: Coords;

	constructor(scaleFactors: Coords)
	{
		this.scaleFactors = scaleFactors;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		coordsToTransform.multiply(this.scaleFactors);

		return coordsToTransform;
	}

}
