
class Face implements Serializable<Face>
{
	materialName: string;
	vertexIndices: number[];
	textureUVsForVertices: Coords[];
	normalsForVertices: Coords[];

	_edges: Edge[];
	_plane: Plane;
	_triangles: Face[];

	_displacementFromVertexNextToPos: Coords;
	_texelColor: Color;
	_vertexValueInterpolated: Coords;
	_vertexValueWeighted: Coords;

	constructor
	(
		materialName: string,
		vertexIndices: number[],
		textureUVsForVertices: Coords[],
		normalsForVertices: Coords[]
	)
	{
		this.materialName = materialName;
		this.vertexIndices = vertexIndices;
		this.textureUVsForVertices = textureUVsForVertices;
		this.normalsForVertices = normalsForVertices;

		this._displacementFromVertexNextToPos = Coords.create();
		this._texelColor = Color.blank("_texelColor");
		this._vertexValueInterpolated = Coords.create();
		this._vertexValueWeighted = Coords.create();
	}

	buildTriangles(mesh: Mesh): Face[]
	{
		var triangles = [];

		if (this.vertexIndices.length == 3)
		{
			triangles = [ this.clone() ];
		}
		else if (this.vertexIndices.length == 4)
		{
			triangles = 
			[
				this.buildTriangle(0, 1, 2).recalculateDerivedValues(mesh),
				this.buildTriangle(2, 3, 0).recalculateDerivedValues(mesh),
			];
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
		
		var returnValue = new Face
		(
			this.materialName, 
			[
				vertexIndex0,
				vertexIndex1,
				vertexIndex2,
			],
			(
				this.textureUVsForVertices == null
				? null
				:
				[
					this.textureUVsForVertices[vertexIndexIndex0],
					this.textureUVsForVertices[vertexIndexIndex1],
					this.textureUVsForVertices[vertexIndexIndex2],
				]
			),
			(
				this.normalsForVertices == null 
				? null
				:
				[
					this.normalsForVertices[vertexIndexIndex0],
					this.normalsForVertices[vertexIndexIndex1],
					this.normalsForVertices[vertexIndexIndex2],
				]
			)
		);

		return returnValue;
	}

	edges(): Edge[]
	{
		if (this._edges == null)
		{
			this._edges = [];

			for (var i = 0; i < this.vertexIndices.length; i++)
			{
				var iNext = NumberHelper.wrapValueToRange
				(
					i + 1, this.vertexIndices.length
				);

				var vertexIndex = this.vertexIndices[i];
				var vertexIndexNext = this.vertexIndices[iNext];

				var edge = new Edge([vertexIndex, vertexIndexNext]);
				
				this._edges.push(edge);
			}
		}

		return this._edges;
	}

	interpolateVertexValuesForWeights
	(
		vertexValues: Coords[], weights: number[]
	): Coords
	{
		var valueInterpolated = this._vertexValueInterpolated.overwriteWith
		(
			vertexValues[0]
		).multiplyScalar
		(
			weights[0]
		);

		var _vertexValueWeighted = this._vertexValueWeighted;

		for (var i = 1; i < vertexValues.length; i++)
		{
			_vertexValueWeighted.overwriteWith
			(
				vertexValues[i]
			).multiplyScalar
			(
				weights[i]
			);

			valueInterpolated.add(_vertexValueWeighted);
		}

		return valueInterpolated;
	}

	material(scene: Scene): Material
	{
		return scene.materialByName(this.materialName);
	}

	normalForVertexWeights(mesh: Mesh, vertexWeights: number[]): Coords
	{
		var returnValue;

		if (this.normalsForVertices == null)
		{
			returnValue = this.plane(mesh).normal;
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

	plane(mesh: Mesh): Plane
	{
		if (this._plane == null)
		{
			var vertices = this.vertices(mesh);

			this._plane = new Plane
			(
				Vertex.positionsForMany(vertices)
			);
		}

		return this._plane;
	}

	recalculateDerivedValues(mesh: Mesh): Face
	{
		if (this.normalsForVertices != null)
		{
			for (var i = 0; i < this.normalsForVertices.length; i++)
			{
				var normalForVertex = this.normalsForVertices[i];
				normalForVertex.normalize();
			}
		}

		var plane = this.plane(mesh);
		plane.recalculateDerivedValues();

		var triangles = this.triangles(mesh);

		if (triangles.length > 1)
		{
			for (var t = 0; t < triangles.length; t++)
			{
				var triangle = triangles[t];
				triangle.recalculateDerivedValues(mesh);
			}
		}

		var edges = this.edges();

		for (var i = 0; i < edges.length; i++)
		{
			edges[i].recalculateDerivedValues(mesh, this);
		}

		return this;
	}

	texelColorForVertexWeights(texture: Texture, vertexWeights: number[]): Color
	{
		var texelUV = this.interpolateVertexValuesForWeights
		(
			this.textureUVsForVertices,
			vertexWeights
		);

		var _texelColor = this._texelColor;

		texture.colorSetFromUV(_texelColor, texelUV);

		return _texelColor;
	}

	triangles(mesh: Mesh): Face[]
	{
		if (this._triangles == null)
		{
			this._triangles = this.buildTriangles(mesh);
		}
		return this._triangles;
	}

	vertexWeightsAtSurfacePosAddToList
	(
		mesh: Mesh,
		surfacePos: Coords,
		weights: number[]
	)
	{
		var vertices = this.vertices(mesh);
		
		var edges = this.edges();

		var areaOfFace = edges[1].displacement.clone().crossProduct
		(
			edges[0].displacement
		).magnitude() / 2;

		var _displacementFromVertexNextToPos =
			this._displacementFromVertexNextToPos;

		for (var i = 0; i < vertices.length; i++)
		{
			var iNext = NumberHelper.wrapValueToRange
			(
				i + 1,
				vertices.length
			);

			// var vertex = vertices[i];
			var vertexNext = vertices[iNext];

			_displacementFromVertexNextToPos.overwriteWith
			(
				surfacePos
			).subtract
			(
				vertexNext.pos
			);

			var displacementOfEdgeNext = edges[iNext].displacement;

			var areaOfTriangleFormedByEdgeNextAndPos =
				displacementOfEdgeNext.clone().crossProduct
				(
					_displacementFromVertexNextToPos
				).magnitude() / 2;

			var weightOfVertex = 
				areaOfTriangleFormedByEdgeNextAndPos
				/ areaOfFace;
			
			weights[i] = weightOfVertex;
		}

		return weights;
	}

	vertex(mesh: Mesh, vertexIndexIndex: number): Vertex
	{
		var vertexIndex = this.vertexIndices[vertexIndexIndex];
		var vertex = mesh.vertices[vertexIndex];
		return vertex;
	}

	vertices(mesh: Mesh): Vertex[]
	{
		var returnValues = new Array<Vertex>();

		for (var i = 0; i < this.vertexIndices.length; i++)
		{
			var vertexIndex = this.vertexIndices[i];
			var vertex = mesh.vertices[vertexIndex];
			returnValues.push(vertex);
		}

		return returnValues;
	}

	// cloneable

	clone(): Face
	{
		// todo - Deep clone.
		return new Face
		(
			this.materialName, 
			this.vertexIndices, 
			this.textureUVsForVertices, 
			this.normalsForVertices
		);
	}

	// strings

	toStringForMesh(mesh: Mesh): string
	{
		var returnValue = this.vertices(mesh).join("->");
		return returnValue;
	}

	// Serializable.

	fromJson(objectAsJson: string): Face
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Face
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		if (this.textureUVsForVertices != null)
		{
			this.textureUVsForVertices.forEach(x => typeSetOnObject(Coords, x) );
		}

		if (this.normalsForVertices != null)
		{
			this.normalsForVertices.forEach(x => typeSetOnObject(Coords, x) );
		}

		if (this._edges != null)
		{
			this._edges.forEach(x => typeSetOnObject(Edge, x) );
		}

		if (this._plane != null)
		{
			typeSetOnObject(Plane, this._plane);
		}

		if (this._triangles != null)
		{
			this._triangles.forEach(x => typeSetOnObject(Face, x) );
		}

		typeSetOnObject(Coords, this._displacementFromVertexNextToPos);
		typeSetOnObject(Color, this._texelColor);
		typeSetOnObject(Coords, this._vertexValueInterpolated);
		typeSetOnObject(Coords, this._vertexValueWeighted);

		return this;
	}

}
