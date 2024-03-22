
class TransformMultiple
{
	constructor(children)
	{
		this.children = children;
	}

	transformCoords(coordsToTransform)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			this.children[i].transformCoords(coordsToTransform);
		}

		return coordsToTransform;
	}
}
