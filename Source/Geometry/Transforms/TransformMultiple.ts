
class TransformMultiple implements Transform
{
	children: Transform[];

	constructor(children: Transform[])
	{
		this.children = children;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		for (var i = 0; i < this.children.length; i++)
		{
			this.children[i].transformCoords(coordsToTransform);
		}

		return coordsToTransform;
	}
}
