
class Mesh implements Shape
{
	typeName: string;

	name: string;
	vertices: Vertex[];
	faces: Face[];

	_vertexWeightsAtSurfacePos: number[];

	constructor
	(
		name: string, 
		vertices: Vertex[], 
		faces: Face[]
	)
	{
		this.typeName = Mesh.name;

		this.name = name;
		this.vertices = vertices;
		this.faces = faces;
		this.recalculateDerivedValues();

		this._vertexWeightsAtSurfacePos = [];
	}

	// constants

	static VerticesInATriangle: number = 3;

	// methods

	clone(): Mesh
	{
		var returnValue = new Mesh
		(
			this.name,
			Cloneable.cloneMany(this.vertices), 
			Cloneable.cloneMany(this.faces)
		);

		return returnValue;
	}

	overwriteWith(other: Mesh): Mesh
	{
		Cloneable.overwriteManyWithOthers(this.vertices, other.vertices);
		return this;
	}

	recalculateDerivedValues(): void
	{
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
			face.recalculateDerivedValues(this);
		}
	}

	// Shape.

	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	{
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
			var facePlane = face.plane(this);

			if (facePlane.normal.dotProduct(ray.direction) < 0)
			{
				var collision = new Collision().rayAndFace
				(
					ray,
					this, // mesh
					face
				);

				if (collision.colliderByName(Face.name) != null)
				{
					collision.colliderByNameSet(ShapeHelper.name, this);
					listToAddTo.push(collision);
				}
			}
		}

		return listToAddTo;
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
		var face = collisionClosest.colliderByName("Triangle");
		if (face == null)
		{
			throw new Error("todo");
		}

		var surfacePos = collisionClosest.pos;

		var _vertexWeightsAtSurfacePos =
			face.vertexWeightsAtSurfacePosAddToList
			(
				this, // mesh
				surfacePos,
				this._vertexWeightsAtSurfacePos
			);

		var faceMaterial = face.material(scene);

		surfaceMaterial.overwriteWith(faceMaterial);

		var textureShouldBeUsed = surfaceMaterial.textureIsSetAndLoaded();

		if (textureShouldBeUsed == false)
		{
			surfaceColor.overwriteWith
			(
				surfaceMaterial.color
			);
		}
		else
		{
			var texelColor = face.texelColorForVertexWeights
			(
				surfaceMaterial.texture, 
				_vertexWeightsAtSurfacePos
			);

			if (texelColor != null)
			{
				surfaceColor.overwriteWith(texelColor);
			}
		}

		surfaceNormal.overwriteWith
		(
			face.normalForVertexWeights
			(
				_vertexWeightsAtSurfacePos
			)
		); 

		return surfaceColor;
	}

	// Serializable.

	fromJson(objectAsJson: string): Mesh
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Mesh
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;
		this.vertices.forEach(x => typeSetOnObject(Vertex, x) );
		this.faces.forEach(x => typeSetOnObject(Face, x) );
		return this;
	}

}
