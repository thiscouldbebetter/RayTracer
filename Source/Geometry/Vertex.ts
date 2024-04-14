
class Vertex implements Serializable<Vertex>
{
	pos: Coords;

	constructor(pos: Coords)
	{
		this.pos = pos;
	}

	clone(): Vertex
	{
		return new Vertex(this.pos.clone());
	}

	static positionsForMany(vertices: Vertex[]): Coords[]
	{
		var returnValues = [];

		for (var i = 0; i < vertices.length; i++)
		{
			returnValues.push(vertices[i].pos);
		}

		return returnValues;
	}

	// strings

	toString(): string
	{
		return this.pos.toString();
	}

	// Serializable.

	fromJson(objectAsJson: string): Vertex
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Vertex
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		typeSetOnObject(Coords, this.pos);

		return this;
	}
}
