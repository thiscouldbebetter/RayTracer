
class Face implements Shape
{
	name: string;
	materialName: string;
	vertexIndices: number[];
	textureUvsForVertices: Coords[];
	normalsForVertices: Coords[];

	typeName: string;

	_edges: Edge[];
	_mesh: Mesh;
	_plane: Plane;
	_triangles: Face[];

	constructor
	(
		name: string,
		materialName: string,
		vertexIndices: number[],
		textureUvsForVertices: Coords[],
		normalsForVertices: Coords[]
	)
	{
		this.name = name;
		this.materialName = materialName;
		this.vertexIndices = vertexIndices;
		this.textureUvsForVertices = textureUvsForVertices;
		this.normalsForVertices = normalsForVertices;

		this.typeName = Face.name;
	}

	static fromMaterialNameAndVertexIndices
	(
		materialName: string,
		vertexIndices: number[]
	): Face
	{
		return new Face(Face.name, materialName, vertexIndices, null, null);
	}

	static fromMaterialNameVertexIndicesTextureUvsAndNormals
	(
		materialName: string,
		vertexIndices: number[],
		textureUvsForVertices: Coords[],
		normalsForVertices: Coords[]
	): Face
	{
		return new Face
		(
			Face.name + materialName,
			materialName,
			vertexIndices,
			textureUvsForVertices,
			normalsForVertices
		);
	}

	buildTriangles(): Face[]
	{
		var triangles = new Array<Face>();

		if (this.vertexIndices.length == 3)
		{
			var triangle = this.clone() as Face;
			triangles.push(triangle);
		}
		else if (this.vertexIndices.length == 4)
		{
			var triangle0 = this.buildTriangle(0, 1, 2).recalculateDerivedValues();
			var triangle1 = this.buildTriangle(2, 3, 0).recalculateDerivedValues();
			triangles.push(triangle0);
			triangles.push(triangle1);
		}
		else
		{
			var errorMessage = "A Face may only have 3 or 4 vertices.";
			throw errorMessage;
		}

		return triangles;
	}

	buildTriangle
	(
		vertexIndexIndex0: number,
		vertexIndexIndex1: number,
		vertexIndexIndex2: number
	): Face
	{
		var vertexIndex0 = this.vertexIndices[vertexIndexIndex0];
		var vertexIndex1 = this.vertexIndices[vertexIndexIndex1];
		var vertexIndex2 = this.vertexIndices[vertexIndexIndex2];

		var vertexIndices =
		[
			vertexIndex0,
			vertexIndex1,
			vertexIndex2
		];

		var textureUvsForVertices = this.textureUvsForVertices;
		textureUvsForVertices =
			textureUvsForVertices == null
			? null
			:
			[
				textureUvsForVertices[vertexIndexIndex0],
				textureUvsForVertices[vertexIndexIndex1],
				textureUvsForVertices[vertexIndexIndex2]
			];

		var normalsForVertices = this.normalsForVertices;
		normalsForVertices =
			normalsForVertices == null 
			? null
			:
			[
				normalsForVertices[vertexIndexIndex0],
				normalsForVertices[vertexIndexIndex1],
				normalsForVertices[vertexIndexIndex2],
			];

		var mesh = this.mesh();

		var returnValue = Face.fromMaterialNameVertexIndicesTextureUvsAndNormals
		(
			this.materialName, 
			vertexIndices,
			textureUvsForVertices,
			normalsForVertices
		).meshSet(mesh);

		return returnValue;
	}

	edges(): Edge[]
	{
		if (this._edges == null)
		{
			var edges = [];

			for (var i = 0; i < this.vertexIndices.length; i++)
			{
				var iNext = NumberHelper.wrapValueToRange
				(
					i + 1, this.vertexIndices.length
				);

				var vertexIndex = this.vertexIndices[i];
				var vertexIndexNext = this.vertexIndices[iNext];

				var edge = Edge.fromVertexIndexPair
				(
					vertexIndex, vertexIndexNext
				);

				edges.push(edge);
			}

			this._edges = edges;
		}

		return this._edges;
	}

	interpolateVertexValuesForWeights
	(
		vertexValues: Coords[], weights: number[]
	): Coords
	{
		var valueInterpolated =
			this.vertexValueInterpolated()
				.overwriteWith(vertexValues[0])
				.multiplyScalar(weights[0]);

		var vertexValueWeighted = this.vertexValueWeighted();

		for (var i = 1; i < vertexValues.length; i++)
		{
			vertexValueWeighted
				.overwriteWith(vertexValues[i])
				.multiplyScalar(weights[i]);

			valueInterpolated.add(vertexValueWeighted);
		}

		return valueInterpolated;
	}

	material(scene: Scene): Material
	{
		return scene.materialByName(this.materialName);
	}

	mesh(): Mesh
	{
		if (this._mesh == null)
		{
			throw new Error("Face._mesh not set!");
		}
		return this._mesh;
	}

	meshSet(mesh: Mesh): Face
	{
		this._mesh = mesh;
		return this;
	}

	normalForVertexWeights(vertexWeights: number[]): Coords
	{
		var returnValue;

		if (this.normalsForVertices == null)
		{
			returnValue = this.plane().normal;
		}
		else
		{
			returnValue = this.interpolateVertexValuesForWeights
			(
				this.normalsForVertices,
				vertexWeights
			);
		}
		
		return returnValue;	
	}

	plane(): Plane
	{
		if (this._plane == null)
		{
			var vertices = this.vertices();

			this._plane = new Plane
			(
				this.name + Plane.name,
				vertices.map(x => x.pos)
			);
		}

		return this._plane;
	}

	recalculateDerivedValues(): Face
	{
		if (this.normalsForVertices != null)
		{
			for (var i = 0; i < this.normalsForVertices.length; i++)
			{
				var normalForVertex = this.normalsForVertices[i];
				normalForVertex.normalize();
			}
		}

		var plane = this.plane();
		plane.recalculateDerivedValues();

		var triangles = this.triangles();

		if (triangles.length > 1)
		{
			for (var t = 0; t < triangles.length; t++)
			{
				var triangle = triangles[t];
				triangle.recalculateDerivedValues();
			}
		}

		var edges = this.edges();

		for (var i = 0; i < edges.length; i++)
		{
			edges[i].recalculateDerivedValues();
		}

		return this;
	}

	texelColorForVertexWeights
	(
		texture: Texture,
		vertexWeights: number[]
	): Color
	{
		var texelUv = this.interpolateVertexValuesForWeights
		(
			this.textureUvsForVertices,
			vertexWeights
		);

		var texelColor = this.texelColor();

		texture.colorSetFromUv(texelColor, texelUv);

		return texelColor;
	}

	triangles(): Face[]
	{
		if (this._triangles == null)
		{
			this._triangles = this.buildTriangles();
		}
		return this._triangles;
	}

	vertexWeightsAtSurfacePosAddToList
	(
		surfacePos: Coords,
		weights: number[]
	): number[]
	{
		var mesh = this.mesh();

		var vertices = this.vertices();

		var edges = this.edges();

		var edge0Displacement = edges[0].displacement(mesh);
		var edge1Displacement = edges[1].displacement(mesh);

		var areaOfFace =
			edge1Displacement
				.clone()
				.crossProduct(edge0Displacement)
				.magnitude() / 2;

		var displacementFromVertexNextToPos =
			this.displacementFromVertexNextToPos();

		var weights = new Array<number>();

		for (var i = 0; i < vertices.length; i++)
		{
			var iNext = NumberHelper.wrapValueToRange
			(
				i + 1,
				vertices.length
			);

			// var vertex = vertices[i];
			var vertexNext = vertices[iNext];

			displacementFromVertexNextToPos
				.overwriteWith(surfacePos)
				.subtract(vertexNext.pos);

			var displacementOfEdgeNext = edges[iNext].displacement(mesh);

			var areaOfTriangleFormedByEdgeNextAndPos =
				displacementOfEdgeNext.clone().crossProduct
				(
					displacementFromVertexNextToPos
				).magnitude() / 2;

			var weightOfVertex = 
				areaOfTriangleFormedByEdgeNextAndPos
				/ areaOfFace;

			weights[i] = weightOfVertex;
		}

		return weights;
	}

	vertexAtIndex(vertexIndexIndex: number): Vertex
	{
		var mesh = this.mesh();
		var vertexIndex = this.vertexIndices[vertexIndexIndex];
		var vertex = mesh.vertices[vertexIndex];
		return vertex;
	}

	vertices(): Vertex[]
	{
		var returnValues = new Array<Vertex>();

		var mesh = this.mesh();

		for (var i = 0; i < this.vertexIndices.length; i++)
		{
			var vertexIndex = this.vertexIndices[i];
			var vertex = mesh.vertices[vertexIndex];
			returnValues.push(vertex);
		}

		return returnValues;
	}

	// cloneable

	clone(): Shape
	{
		return new Face
		(
			this.name,
			this.materialName, 
			this.vertexIndices.map(x => x), 
			this.textureUvsForVertices.map(x => x.clone() ), 
			this.normalsForVertices == null ? null : this.normalsForVertices.map(x => x.clone() )
		).meshSet(this.mesh() );
	}

	// strings

	toString(): string
	{
		var returnValue = this.vertices().join("->");
		return returnValue;
	}

	// Shape.

	addCollisionsWithRayToList(ray: Ray, listToAddTo: Collision[]): Collision[]
	{
		throw new Error("To be implemented!");
	}

	fromJson(objectAsJson: string): Shape
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Shape
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		if (this.textureUvsForVertices != null)
		{
			this.textureUvsForVertices.forEach
			(
				x => typeSetOnObject(Coords, x)
			);
		}

		if (this.normalsForVertices != null)
		{
			this.normalsForVertices.forEach
			(
				x => typeSetOnObject(Coords, x)
			);
		}

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

	surfaceMaterialColorAndNormalForCollision
	(
		scene: Scene, 
		collision: Collision
	): Color
	{
		throw new Error("To be implemented!");
	}

	transformApply(transform: Transform): Shape
	{
		throw new Error("To be implemented!");
	}

	// Temporary variables.

	displacementFromVertexNextToPos(): Coords
	{
		if (this._displacementFromVertexNextToPos == null)
		{
			this._displacementFromVertexNextToPos = Coords.create();
		}
		return this._displacementFromVertexNextToPos;
	}
	_displacementFromVertexNextToPos: Coords;

	texelColor(): Color
	{
		if (this._texelColor == null)
		{
			this._texelColor = Color.create();
		}
		return this._texelColor;
	}
	_texelColor: Color;

	vertexValueInterpolated(): Coords
	{
		if (this._vertexValueInterpolated == null)
		{
			this._vertexValueInterpolated = Coords.create();
		}
		return this._vertexValueInterpolated;
	}
	_vertexValueInterpolated: Coords;

	vertexValueWeighted(): Coords
	{
		if (this._vertexValueWeighted == null)
		{
			this._vertexValueWeighted = Coords.create();
		}
		return this._vertexValueWeighted;
	}
	_vertexValueWeighted: Coords;

}
