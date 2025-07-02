
class Plane implements Shape
{
	name: string
	positionsOnPlane: Coords[];

	normal: Coords;
	distanceFromOrigin: number;

	typeName: string;

	constructor(name: string, positionsOnPlane: Coords[])
	{
		this.name = name;
		this.positionsOnPlane = positionsOnPlane;

		this.normal = Coords.create();
		this.recalculateDerivedValues();

		this.typeName = Plane.name;
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

	// Shape.

	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	{
		throw new Error("To be implemented!");
	}

	clone(): Shape
	{
		return new Plane(this.name, this.positionsOnPlane.map(x => x.clone() ) );
	}

	surfaceMaterialColorAndNormalForCollision
	(
		scene: Scene, 
		collision: Collision,
	): Color
	{
		throw new Error("To be implemented!");
	}

	transformApply(transform: Transform): Shape
	{
		throw new Error("To be implemented!");
	}

	// Serializable.

	fromJson(objectAsJson: string): Shape
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Shape
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		typeSetOnObject(Coords, this.normal);
		this.positionsOnPlane.forEach(x => typeSetOnObject(Coords, x) );

		return this;
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	toObjectSerializable(): any
	{
		return this;
	}

}
