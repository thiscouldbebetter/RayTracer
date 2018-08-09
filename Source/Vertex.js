
function Vertex(pos)
{
	this.pos = pos;
}
{
	Vertex.prototype.clone = function()
	{
		return new Vertex(this.pos.clone());
	}

	Vertex.positionsForMany = function(vertices)
	{
		var returnValues = [];

		for (var i = 0; i < vertices.length; i++)
		{
			returnValues.push(vertices[i].pos);
		}

		return returnValues;
	}

	// strings

	Vertex.prototype.toString = function()
	{
		return this.pos.toString();
	}
}
