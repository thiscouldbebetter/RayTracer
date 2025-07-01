
class MeshBuilder
{
	static boxFromNameMaterialAndSize
	(
		name: string, material: Material, size: Coords
	)
	{
		var meshCube =
			MeshBuilder.cubeUnitFromNameAndMaterial
			(
				name, material
			);

		var sizeHalf = size.clone().half();

		var transformScaleAndRaiseBottomToGroundLevel =
			TransformMultiple.fromChildren
			([
				TransformScale.fromScaleFactors(sizeHalf),
				TransformTranslate.fromOffset
				(
					Coords.create().zSet(0 - sizeHalf.z)
				),
			]);

		var meshBox =
			meshCube
				.transformApply(transformScaleAndRaiseBottomToGroundLevel);

		return meshBox;
	}

	static cubeUnitFromNameAndMaterial
	(
		name: string, material: Material
	): Mesh
	{
		var c3 = (x: number, y: number, z: number) => Coords.fromXYZ(x, y, z);

		var vertexPositions =
		[ 
			c3(-1, -1, -1), // 0
			c3(1, -1, -1), // 1
			c3(1, 1, -1), // 2
			c3(-1, 1, -1), // 3

			c3(-1, -1, 1), // 4
			c3(1, -1, 1), // 5
			c3(1, 1, 1), // 6
			c3(-1, 1, 1) // 7
		];

		var vertices = vertexPositions.map(x => Vertex.fromPos(x) );

		var materialName = material.name;

		var c = (x: number, y: number) => Coords.fromXY(x, y);

		var f =
			(vis: number[], cs: Coords[]) =>
				new Face(Face.name + vis.join("-"), materialName, vis, cs, null); // normals

		var faces =
		[
			f( [3, 2, 1, 0], [ c(0, 1), c(1, 1), c(1, 0), c(0, 0) ] ), // top
			f( [4, 5, 6, 7], [ c(0, 0), c(1, 0), c(1, 1), c(0, 1) ] ), // bottom
			f( [0, 1, 5, 4], [ c(1, 0), c(0, 0), c(0, 1), c(1, 1) ] ), // north
			f( [2, 3, 7, 6], [ c(1, 0), c(0, 0), c(0, 1), c(1, 1) ] ), // south
			f( [1, 2, 6, 5], [ c(1, 0), c(0, 0), c(0, 1), c(1, 1) ] ), // east 
			f( [4, 7, 3, 0], [ c(0, 1), c(1, 1), c(1, 0), c(0, 0) ] ) // west
		];

		var returnValue = new Mesh
		(
			name, 
			vertices,
			faces
		);

		return returnValue;
	}

	static gridFromNameMaterialAndSizesInCellsAndPixels
	(
		name: string,
		material: Material,
		sizeInCells: Coords,
		gridSizeInPixels: Coords
	): Mesh
	{
		var cellPosInCells = Coords.create();

		var vertexPositions = new Array<Coords>();

		var vertexPos = Coords.create();

		for (var y = 0; y <= sizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x <= sizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				vertexPos.overwriteWith(cellPosInCells);

				vertexPositions.push(vertexPos.clone() );
			}
		}

		var vertices =
			vertexPositions.map(x => Vertex.fromPos(x) );

		var faces = new Array<Face>();

		var faceFromVertexIndicesAndTextureUvs =
			(vis: number[], uvs: Coords[]) =>
				new Face(Face.name + vis.join("-"), material.name, vis, uvs, null); // normals

		var textureUvsForTriangleNW =
		[
			Coords.fromXY(0, 0),
			Coords.fromXY(1, 0),
			Coords.fromXY(0, 1)
		];

		var textureUvsForTriangleSE =
		[
			Coords.fromXY(1, 0),
			Coords.fromXY(1, 1),
			Coords.fromXY(0, 1)
		];

		var vertexIndexOfCornerNW = 0; // "NW" = "NorthWest".
		var verticesPerRow = sizeInCells.x + 1;

		for (var y = 0; y < sizeInCells.y; y++)
		{
			for (var x = 0; x < sizeInCells.x; x++)
			{
				var vertexIndexOfCornerNE =
					vertexIndexOfCornerNW + 1;

				var vertexIndexOfCornerSE =
					vertexIndexOfCornerNE + verticesPerRow;

				var vertexIndexOfCornerSW =
					vertexIndexOfCornerNW + verticesPerRow;

				var faceForCellTriangleNW =
					faceFromVertexIndicesAndTextureUvs
					(
						[
							vertexIndexOfCornerNW,
							vertexIndexOfCornerNE,
							vertexIndexOfCornerSW
						],
						textureUvsForTriangleNW
					);

				faces.push(faceForCellTriangleNW);

				var faceForCellTriangleSE =
					faceFromVertexIndicesAndTextureUvs
					(
						[
							vertexIndexOfCornerNE,
							vertexIndexOfCornerSE,
							vertexIndexOfCornerSW
						],
						textureUvsForTriangleSE
					);

				faces.push(faceForCellTriangleSE);

				vertexIndexOfCornerNW++;
			}

			vertexIndexOfCornerNW++;
		}

		var meshGrid = new Mesh
		(
			name,
			vertices,
			faces
		);

		var scaleFactors =
			gridSizeInPixels
				.clone()
				.divide(sizeInCells)
				.zSet(0);

		var transform = TransformScale.fromScaleFactors(scaleFactors);
		meshGrid.transformApply(transform);

		return meshGrid;
	}

	static meshVerticesDisplaceRandomlyToDistanceMax
	(
		meshToDistort: Mesh,
		vertexDisplacementDistanceMax: number
	): Mesh
	{
		var vertices = meshToDistort.vertices;
		vertices.forEach
		(
			x =>
				x.pos.add
				(
					Polar
						.create()
						.randomize()
						.toCoords(Coords.create() )
						.multiplyScalar(vertexDisplacementDistanceMax)
				)
		)
		meshToDistort.recalculateDerivedValues(); // Necessary?
		return meshToDistort;
	}

	static rectangleFromNameSizeAndMaterial
	(
		name: string,
		size: Coords,
		material: Material
	): Mesh
	{
		var sizeHalf = size.clone().half();

		var vertexPositions =
		[
			Coords.fromXY(-1, -1),
			Coords.fromXY(1, -1),
			Coords.fromXY(1, 1),
			Coords.fromXY(-1, 1)
		];

		vertexPositions.forEach(x => x.multiply(sizeHalf) );

		var vertices =
			vertexPositions.map(x => Vertex.fromPos(x) );

		var face =
			Face.fromMaterialNameAndVertexIndices
			(
				material.name,
				[3, 2, 1, 0]
			);

		return new Mesh
		(
			name,
			vertices,
			[ face ]
		);
	}
}