
class Sphere implements Shape
{
	typeName: string;

	name: string;
	materialName: string;
	radius: number;
	centerPos: Coords;
	orientation: Orientation;

	constructor
	(
		name: string,
		materialName: string,
		radius: number,
		centerPos: Coords,
		orientation: Orientation
	)
	{
		this.typeName = Sphere.name;

		this.name = name;
		this.materialName = materialName;
		this.radius = radius;
		this.centerPos = centerPos;
		this.orientation = orientation;
	}

	// Shape.

	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
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
		surfaceMaterial.overwriteWith(sphere.material(scene));

		surfaceNormal.overwriteWith
		(
			surfacePos
		).subtract
		(
			sphere.centerPos
		).normalize();

		var textureShouldBeUsed =
			surfaceMaterial.textureIsSetAndLoaded();

		if (textureShouldBeUsed == false)
		{
			surfaceColor.overwriteWith
			(
				surfaceMaterial.color
			);
		}
		else
		{
			var surfaceNormalInLocalCoords = new TransformOrient
			(
				this.orientation
			).transformCoords
			(
				surfaceNormal.clone()
			);

			var surfaceNormalInLocalCoordsAsPolar = Polar.create().fromCoords
			(
				surfaceNormalInLocalCoords
			);

			var texelUv = this.texelUv();
			texelUv.overwriteWithXYZ
			(
				surfaceNormalInLocalCoordsAsPolar.azimuth,
				(1 + surfaceNormalInLocalCoordsAsPolar.elevation) / 2,
				0
			); // todo

			surfaceMaterial.texture.colorSetFromUV
			(
				surfaceColor,
				texelUv
			);
		}

		return surfaceColor;
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
		typeSetOnObject(Coords, this.centerPos);
		typeSetOnObject(Orientation, this.orientation);
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
