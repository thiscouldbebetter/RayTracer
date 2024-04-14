
class Scene
{
	name: string;
	materials: Material[];
	backgroundColor: Color;
	lighting: Lighting;
	camera: Camera;
	collidables: Shape[];

	_materialsByName: Map<string, Material>;

	constructor
	(
		name: string,
		materials: Material[],
		backgroundColor: Color,
		lighting: Lighting,
		camera: Camera,
		collidables: Shape[]
	)
	{
		this.name = name;
		this.materials = materials;
		this.backgroundColor = backgroundColor;
		this.lighting = lighting;
		this.camera = camera;
		this.collidables = collidables;
	}

	static demo(): Scene
	{
		var imageRTBang = ImageHelper.buildImageFromStrings	
		(
			"RTBang",
			1, // scaleMultiplier
			[
				"RRRRRRRRRRRRRRRR",
				"RRcccccRcccccRcR",
				"RRcRRRcRRRcRRRcR",
				"RRcRRRcRRRcRRRcR",
				"RRcccccRRRcRRRcR",
				"RRcRRcRRRRcRRRRR",
				"RRcRRRcRRRcRRRcR",
				"RRRRRRRRRRRRRRRR",
			]
		);

		var materialRTBang = new Material
		(
			"RTBang", 
			Color.Instances().White, 
			1, // diffuse
			1, // specular
			.2, // shininess
			10, // diffuse
			new Texture
			(
				"RTBang", 
				imageRTBang
			)
		);

		var meshMonolith = MeshHelper.transformMeshVertexPositions
		(
			MeshHelper.buildCubeUnit("Monolith", materialRTBang),
			new TransformMultiple
			([
				new TransformScale(new Coords(40, 10, 90)),
				new TransformTranslate(new Coords(0, 0, -90)),

			])
		);

		var meshGround = new Mesh
		(
			"Ground",
			// vertices
			[
				new Vertex(new Coords(-1000, -1000, 0)),
				new Vertex(new Coords(1000, -1000, 0)),
				new Vertex(new Coords(1000, 1000, 0)),
				new Vertex(new Coords(-1000, 1000, 0)),
			],
			// faces
			[
				new Face(Material.Instances().Green.name, [3, 2, 1, 0], null, null)
			]
		);

		var imageEyeball = ImageHelper.buildImageFromStrings
		(
			"ImageEyeball",
			1, // scaleMultiplier
			[
				"k","b","w","w","w","w","w","w","w","w"
			]
		);

		var materialEyeball = new Material
		(
			"MaterialEyeball", 
			Color.Instances().White, 
			1, // diffuse
			1, // specular
			.2, // shininess
			10, // diffuse
			new Texture
			(
				"TextureEyeball", 
				imageEyeball
			)
		);

		var materials = 
		[
			materialEyeball, 
			materialRTBang, 
			Material.Instances().Green,
		]; 

		var sphereEyeball = new Sphere
		(
			"SphereEyeball", 
			materialEyeball.name,
			100, // radius
			new Coords(200, 200, -270),
			new Orientation
			(
				new Coords(1, 0, 0),
				new Coords(1, 1, 0) // down = SE
			)
		);

		var displaySize = new Coords(320, 240, 960);

		var scene = new Scene
		(
			"Scene0",
			materials,
			Color.Instances().BlueDark, // backgroundColor
			new Lighting
			(
				// lights
				[
					//new LightAmbient(.1),
					new LightPoint(30000, new Coords(-200, -200, -300)),
					new LightPoint(60000, new Coords(200, -200, -300)),
					new LightPoint(30000, new Coords(200, 200, -300)),
				]
			),
			new Camera
			(
				displaySize.clone(),
				200, // focalLength
				new Coords(-150, -300, -60), // pos
				new Orientation
				(
					new Coords(1, 2, 0), // forward
					new Coords(0, 0, 1) // down
				)
			),
			// collidables
			[
				sphereEyeball,
				meshMonolith,
				meshGround,
			]
		);

		return scene;
	}

	loadAndSendToCallback(callback: any): void
	{
		var materialsCount = this.materials.length;
		var materialsLoadedSoFarCount = 0;
		var scene = this;
		this.materials.forEach
		(
			m => m.loadAndSendToCallback
			(
				(materialLoaded: Material) =>
				{
					materialsLoadedSoFarCount++;
					if (materialsLoadedSoFarCount >= materialsCount)
					{
						callback(scene);
					}
				}
			)
		);
	}

	materialByName(name: string): Material
	{
		if (this._materialsByName == null)
		{
			this._materialsByName = new Map<string, Material>
			(
				this.materials.map(x => [x.name, x])
			);
		}

		return this._materialsByName.get(name);
	}

	// JSON.

	static fromJson(sceneAsJson: string): Scene
	{
		var serializer = Scene.serializerCreate();
		var scene = serializer.deserialize(sceneAsJson);
		return scene;
	}

	static serializerCreate(): Serializer
	{
		var serializer = new Serializer
		([
			Camera,
			Color,
			Coords,
			Edge,
			Face,
			Image2,
			LightPoint,
			Lighting,
			Material,
			Mesh,
			Orientation,
			Plane,
			Scene,
			Sphere,
			Texture,
			Vertex
		]);

		return serializer;
	}

	toJson(): string
	{
		var serializer = Scene.serializerCreate();
		var sceneAsJson = serializer.serialize(this);
		return sceneAsJson;
	}
}
