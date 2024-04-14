
class Plane implements Serializable<Plane>
{
	positionsOnPlane: Coords[];

	normal: Coords;
	distanceFromOrigin: number;

	constructor(positionsOnPlane: Coords[])
	{
		this.positionsOnPlane = positionsOnPlane;
		this.normal = new Coords(0, 0, 0);
		this.recalculateDerivedValues();
	}

	recalculateDerivedValues(): void
	{
		var pos0 = this.positionsOnPlane[0];
		var displacementFromPos0To1 =
			this.positionsOnPlane[1].clone().subtract(pos0);
		var displacementFromPos0To2 =
			this.positionsOnPlane[2].clone().subtract(pos0);
		this.normal.overwriteWith
		(
			displacementFromPos0To1
		).crossProduct
		(
			displacementFromPos0To2
		).normalize();

		this.distanceFromOrigin = this.normal.dotProduct(pos0);
	}

	// Serializable.

	fromJson(objectAsJson: string): Plane
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Plane
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		typeSetOnObject(Coords, this.normal);
		this.positionsOnPlane.forEach(x => typeSetOnObject(Coords, x) );

		return this;
	}

}
