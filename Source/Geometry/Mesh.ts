
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
		this.faces = faces.map(x => x.meshSet(this) );

		this.recalculateDerivedValues();

		this._vertexWeightsAtSurfacePos = [];
	}

	static fromNameVerticesAndFaces
	(
		name: string, 
		vertices: Vertex[], 
		faces: Face[]
	): Mesh
	{
		return new Mesh(name, vertices, faces);
	}

	// constants

	static VerticesInATriangle: number = 3;

	// methods

	bounds(): Bounds
	{
		return Bounds.ofPoints(this.vertices.map(x => x.pos) );
	}

	// Clonable.

	clone(): Mesh
	{
		var vertices = this.vertices.map(x => x.clone() );
		var faces = this.faces.map(x => x.clone() as Face);

		var returnValue = Mesh.fromNameVerticesAndFaces
		(
			this.name,
			vertices,
			faces
		);

		return returnValue;
	}

	overwriteWith(other: Mesh): Mesh
	{
		for (var i = 0; i < this.vertices.length; i++)
		{
			this.vertices[i].overwriteWith(other.vertices[i]);
		}
		return this;
	}

	recalculateDerivedValues(): void
	{
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
			face.recalculateDerivedValues();
		}
	}

	// Shape.

	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	{
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
			var facePlane = face.plane();

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
				surfacePos,
				this._vertexWeightsAtSurfacePos
			);

		surfaceNormal.overwriteWith
		(
			face.normalForVertexWeights
			(
				_vertexWeightsAtSurfacePos
			)
		); 

		var faceMaterial = face.material(scene);

		surfaceMaterial.overwriteWith(faceMaterial);

		surfaceColor
			.overwriteWith(surfaceMaterial.color);

		var textures = surfaceMaterial.textures; 

		for (var t = 0; t < textures.length; t++)
		{
			var texture = textures[t];

			var texelColor = face.texelColorForVertexWeights
			(
				texture, 
				_vertexWeightsAtSurfacePos
			);

			if (texelColor != null)
			{
				surfaceColor.overwriteWith(texelColor);
			}

			break; // todo
		}

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
		this.faces.forEach
		(
			x =>
			{
				var face = typeSetOnObject(Face, x) as Face;
				face.meshSet(this);
				return face;
			}
		);
		return this;
	}

	// Transformable.

	transformApply(transform: Transform): Mesh
	{
		var vertices = this.vertices;
		for (var v = 0; v < vertices.length; v++)
		{
			var vertex = vertices[v];
			transform.transformCoords(vertex.pos);
		}

		this.recalculateDerivedValues();

		return this;
	}
}
