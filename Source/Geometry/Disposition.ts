
class Disposition
{
	pos: Coords;
	ori: Orientation;

	constructor(pos: Coords, ori: Orientation)
	{
		this.pos = pos;
		this.ori = ori;
	}

	static fromPos(pos: Coords): Disposition
	{
		return new Disposition(pos, Orientation.default() );
	}

	static fromPosAndOri(pos: Coords, ori: Orientation): Disposition
	{
		return new Disposition(pos, ori);
	}

	// Clonable.

	clone(): Disposition
	{
		return new Disposition(this.pos.clone(), this.ori.clone() );
	}

	// Serializable.

	fromJson(): Disposition
	{
		throw new Error("Not yet implemented!");
	}

	prototypesSet(): Disposition
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;
		typeSetOnObject(Coords, this.pos);
		typeSetOnObject(Orientation, this.ori);
		return this;
	}

	toJson(): string
	{
		throw new Error("Not yet implemented!");
	}

	toObjectSerializable(): any
	{
		return this;
	}
}