
class TransformMultiple implements Transform
{
	children: Transform[];

	constructor(children: Transform[])
	{
		this.children = children;
	}

	static fromChildren(children: Transform[])
	{
		return new TransformMultiple(children);
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		this.children
			.forEach(x => x.transformCoords(coordsToTransform) );

		return coordsToTransform;
	}
}
