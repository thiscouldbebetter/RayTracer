
class TransformTranslate implements Transform
{
	offset: Coords;

	constructor(offset: Coords)
	{
		this.offset = offset;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		coordsToTransform.add(this.offset);

		return coordsToTransform;
	}
}
