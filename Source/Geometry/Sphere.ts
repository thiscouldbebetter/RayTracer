
class Sphere implements Shape
{
	typeName: string;

	name: string;
	materialName: string;
	radius: number;
	disp: Disposition;

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

		if (collision.colliderByName(Sphere.name) != null)
		{
			collision.colliderByNameSet(ShapeHelper.name, this);
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
		collisionClosest: Collision,
		surfaceMaterial: Material,
		surfaceColor: Color,
		surfaceNormal: Coords
	): Color
	{
		var sphere = collisionClosest.colliderByName(Sphere.name);
		var surfacePos = collisionClosest.pos;
		var sphereMaterial = sphere.material(scene);
		surfaceMaterial.overwriteWith(sphereMaterial);

		surfaceNormal
			.overwriteWith(surfacePos)
			.subtract(sphere.disp.pos)
			.normalize();

		var surfaceNormalInLocalCoords =
			TransformOrient
				.fromOrientation(this.disp.ori)
				.transformCoords(surfaceNormal.clone());

		var surfaceNormalInLocalCoordsAsPolar =
			Polar
				.create()
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

	toJson(): string
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
