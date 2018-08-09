
function TransformMultiple(children)
{
	this.children = children;
}

{
	TransformMultiple.prototype.transformCoords = function(coordsToTransform)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			this.children[i].transformCoords(coordsToTransform);
		}

		return coordsToTransform;
	}
}
