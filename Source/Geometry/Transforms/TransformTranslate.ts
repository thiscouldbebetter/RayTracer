
class TransformTranslate implements Transform
{
	offset: Coords;

	constructor(offset: Coords)
	{
		this.offset = offset;
	}

	static fromOffset(offset: Coords): TransformTranslate
	{
		return new TransformTranslate(offset);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		coordsToTransform.add(this.offset);

		return coordsToTransform;
	}
}
