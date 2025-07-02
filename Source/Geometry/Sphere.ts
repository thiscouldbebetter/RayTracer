
class Sphere implements Shape
{
	typeName: string;

	name: string;
	materialName: string;
	radius: number;
	disp: Disposition;

	_polar: Polar;
	_transformOrient: TransformOrient;

	constructor
	(
		name: string,
		materialName: string,
		radius: number,
		disp: Disposition
	)
	{
		this.typeName = Sphere.name;

		this.name = name;
		this.materialName = materialName;
		this.radius = radius;
		this.disp = disp;

		this._polar = Polar.create();
		this._transformOrient =
			TransformOrient.create();
	}

	// Shape.

	addCollisionsWithRayToList
	(
		ray: Ray, listToAddTo: Collision[]
	): Collision[]
	{
		var collision = new Collision().rayAndSphere
		(
			ray,
			this
		);

		if (collision.shapeCollidingWithName(Sphere.name) != null)
		{
			collision.shapeCollidingAdd(this);
			listToAddTo.push(collision);
		}

		return listToAddTo;
	}

	material(scene: Scene): Material
	{
		return scene.materialByName(this.materialName);
	}

	surfaceMaterialColorAndNormalForCollision
	(
		scene: Scene, 
		collision: Collision
	): Color
	{
		var sphere =
			collision.shapeCollidingWithName(Sphere.name) as Sphere;

		var surfacePos = collision.pos;
		var sphereMaterial = sphere.material(scene);
		var surfaceMaterial =
			collision.surfaceMaterial.overwriteWith(sphereMaterial);
		var surfaceColor = collision.surfaceColor;

		var surfaceNormal =
			collision.surfaceNormal
				.overwriteWith(surfacePos)
				.subtract(sphere.disp.pos)
				.normalize();

		var surfaceNormalInLocalCoords =
			this._transformOrient
				.orientationSet(this.disp.ori)
				.transformCoords(surfaceNormal.clone());

		var surfaceNormalInLocalCoordsAsPolar =
			this._polar
				.fromCoords(surfaceNormalInLocalCoords);

		var texelUv = this.texelUv();
		texelUv.overwriteWithXYZ
		(
			surfaceNormalInLocalCoordsAsPolar.azimuth,
			(1 + surfaceNormalInLocalCoordsAsPolar.elevation) / 2,
			0
		); // todo

		surfaceMaterial.colorSetFromUv
		(
			surfaceColor,
			texelUv
		);

		return surfaceColor;
	}

	transformApply(transform: Transform): Sphere
	{
		transform.transformCoords(this.disp.pos);
		return this;
	}

	// Clonable.

	clone(): Sphere
	{
		return new Sphere
		(
			this.name,
			this.materialName,
			this.radius,
			this.disp.clone()
		);
	}

	// Serializable.

	fromJson(objectAsJson: string): Sphere
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Sphere
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;
		typeSetOnObject(Disposition, this.disp);
		this.disp.prototypesSet();
		typeSetOnObject(Coords, this._texelUv);
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

	// Temporary variables.

	texelUv(): Coords
	{
		if (this._texelUv == null)
		{
			this._texelUv = Coords.create();
		}
		return this._texelUv;
	}
	_texelUv: Coords;
}
