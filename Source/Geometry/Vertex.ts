
class Vertex implements Serializable<Vertex>
{
	pos: Coords;

	constructor(pos: Coords)
	{
		this.pos = pos;
	}

	static fromPos(pos: Coords): Vertex
	{
		return new Vertex(pos);
	}

	// Clonable.

	clone(): Vertex
	{
		return new Vertex(this.pos.clone());
	}

	overwriteWith(other: Vertex): Vertex
	{
		this.pos.overwriteWith(other.pos);
		return this;
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
