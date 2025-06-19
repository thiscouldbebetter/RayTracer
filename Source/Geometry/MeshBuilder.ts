
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
				new Face(materialName, vis, cs, null); // normals

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