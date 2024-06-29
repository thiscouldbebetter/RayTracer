
class Scene implements Serializable<Scene>
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

	static create(): Scene
	{
		return new Scene(null, null, null, null, null, null);
	}

	static demo(): Scene
	{
		var imageRTBang = new Image2
		(
			"RTBang",
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

		var imageEyeball = new Image2
		(
			"ImageEyeball",
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

	// Drawing.

	_collisions: Collision[];
	_directionFromEyeToPixel: Coords;
	_displacementFromEyeToPixel: Coords;
	_material: Material;
	_pixelColor: Color;
	_surfaceNormal: Coords;
	_texelColor: Color;
	_texelUV: Coords;
	_vertexWeightsAtSurfacePos: any[];

	drawToDisplay(display: Display): void
	{
		this.drawToDisplay_InitializeTemporaryVariables();

		this.drawToDisplay_Background(display);

		var sizeInTiles = Coords.fromXY(1, 1);
		var tileSizeInPixels = display.sizeInPixels.clone().divide
		(
			sizeInTiles
		);

		var tilePosInTiles = Coords.create();
	 	var tileBounds = new Bounds
		(
			Coords.create(),
			Coords.create()
		);
		
		for (var y = 0; y < sizeInTiles.y; y++)
		{
			tilePosInTiles.y = y;

			for (var x = 0; x < sizeInTiles.x; x++)
			{
				tilePosInTiles.x = x;

				tileBounds.min.overwriteWith
				(
					tilePosInTiles
				).multiply
				(
					tileSizeInPixels
				);

				tileBounds.max.overwriteWith
				(
					tileBounds.min
				).add
				(
					tileSizeInPixels
				);

				this.drawToDisplay_PixelsGetAndDrawForBounds
				(
					display, tileBounds
				);
			}
		}
	}

	drawToDisplay_InitializeTemporaryVariables(): void
	{
		this._collisions = [];
		this._directionFromEyeToPixel = Coords.create();
		this._displacementFromEyeToPixel = Coords.create();
		this._material = Material.fromNameAndColor
		(
			"DisplayMaterial",
			Color.blank("MaterialColor")
		);
		this._pixelColor = Color.blank("PixelColor");
		this._surfaceNormal = Coords.create();
		this._texelColor = Color.blank("TexelColor");
		this._texelUV = Coords.create();
		this._vertexWeightsAtSurfacePos = [];

	}

	drawToDisplay_Background(display: Display): void
	{
		display.fillWithColor(this.backgroundColor);
	}

	drawToDisplay_PixelsGetAndDrawForBounds
	(
		display: Display, bounds: Bounds
	): void
	{
		var boundsMin = bounds.min;
		var boundsMax = bounds.max;

		var pane = new Pane(boundsMin, boundsMax);

		this.drawToDisplay_PaneRender(display, pane);

		pane.drawToDisplay(display);
	}

	drawToDisplay_PaneRender(display: Display, pane: Pane)
	{
		var scene = this;

		var pixelColor = scene._pixelColor;
		var sceneBackgroundColor = scene.backgroundColor;

		var paneSize = pane.sizeInPixels;
		var boundsMin = pane.boundsMin;

		var pixelPosAbsolute = Coords.create();
		var pixelPosRelative = Coords.create();

		for (var y = 0; y < paneSize.y; y++)
		{
			pixelPosRelative.y = y;

			for (var x = 0; x < paneSize.x; x++)
			{
				pixelPosRelative.x = x;

				pixelPosAbsolute
					.overwriteWith(pixelPosRelative)
					.add(boundsMin);

				var collisionForRayFromCameraToPixel =
					scene.drawToDisplay_ColorSetFromPixelAtPos
					(
						pixelColor,
						pixelPosAbsolute
					);

				if (collisionForRayFromCameraToPixel == null)
				{
					pixelColor.overwriteWith(sceneBackgroundColor);
				}

				pane.pixelAtPosRelativeSetToColor
				(
					pixelPosRelative, pixelColor
				);
			}
		}

	}

	drawToDisplay_ColorSetFromPixelAtPos
	(
		surfaceColor: Color,
		pixelPos: Coords
	): Collision
	{
		var collisionClosest = this.drawToDisplay_Pixel_FindClosestCollision
		(
			pixelPos
		);

		if (collisionClosest != null)
		{
			var collidable =
				collisionClosest.colliderByName("Collidable");

			var surfaceNormal = this._surfaceNormal;
			var surfaceMaterial = this._material;

			collidable.surfaceMaterialColorAndNormalForCollision
			(
				this,
				collisionClosest,
				surfaceMaterial,
				surfaceColor,
				surfaceNormal
			);

			var intensityFromLightsAll = 0;

			var lights = this.lighting.lights;

			for (var i = 0; i < lights.length; i++)
			{
				var light = lights[i];

				var intensity = light.intensityForCollisionMaterialNormalAndCamera
				(
					collisionClosest,
					surfaceMaterial,
					surfaceNormal,
					this.camera
				);

				intensityFromLightsAll += intensity;
			}

			surfaceColor.multiply
			(
				intensityFromLightsAll 
			);
		}

		return collisionClosest;
	}

	drawToDisplay_Pixel_FindClosestCollision
	(
		pixelPos: Coords
	)
	{
		var camera = this.camera;
		var cameraOrientation = camera.orientation;

		var displacementFromEyeToPixel = this._displacementFromEyeToPixel;
		var cameraOrientationTemp = Orientation.Instances().Camera;
		var cameraForward = cameraOrientationTemp.forward;
		var cameraRight = cameraOrientationTemp.right;
		var cameraDown = cameraOrientationTemp.down;
		var displaySizeInPixelsHalf = camera.viewSizeHalf();

		displacementFromEyeToPixel.overwriteWith
		(
			cameraForward.overwriteWith
			(
				cameraOrientation.forward
			).multiplyScalar
			(
				camera.focalLength
			)
		).add
		(
			cameraRight.overwriteWith
			(
				cameraOrientation.right
			).multiplyScalar
			(
				pixelPos.x - displaySizeInPixelsHalf.x
			)
		).add
		(
			cameraDown.overwriteWith
			(
				cameraOrientation.down
			).multiplyScalar
			(
				pixelPos.y - displaySizeInPixelsHalf.y
			)
		);

		var directionFromEyeToPixel = this._directionFromEyeToPixel;
		directionFromEyeToPixel.overwriteWith
		(
			displacementFromEyeToPixel
		).normalize();

		var rayFromEyeToPixel = new Ray
		(
			camera.pos,
			directionFromEyeToPixel
		);

		var collisions = this._collisions;
		collisions.length = 0;

		var collidables = this.collidables;

		for (var i = 0; i < collidables.length; i++)
		{
			var collidable = collidables[i];

			collidable.addCollisionsWithRayToList
			(
				rayFromEyeToPixel,
				collisions
			);
		}

		var collisionClosest = null;

		if (collisions.length > 0)
		{
			collisionClosest = collisions[0];

			for (var c = 1; c < collisions.length; c++)
			{
				var collision = collisions[c];
				if (collision.distanceToCollision < collisionClosest.distanceToCollision)
				{
					collisionClosest = collision;
				}
			}
		}

		return collisionClosest;
	}

	// Serializable.

	prototypesSet(): Scene
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		this.materials.forEach(x => typeSetOnObject(Material, x) );
		typeSetOnObject(Color, this.backgroundColor);
		typeSetOnObject(Lighting, this.lighting);
		typeSetOnObject(Camera, this.camera);
		this.collidables.forEach(x => ShapeHelper.typeSetOnShape(x) );

		return this;
	}

	fromJson(objectAsJson: string): Scene
	{
		var scene: Scene;
		try
		{
			scene = SerializableHelper.objectOfTypeFromJson(Scene, objectAsJson);
		}
		catch (err)
		{
			console.log("Error deserializing scene.");
		}
		return scene;
	}

	static fromJson(objectAsJson: string): Scene
	{
		return Scene.create().fromJson(objectAsJson);
	}

	toJson(): string
	{
		var sceneAsJson = JSON.stringify(this, null, 4);
		return sceneAsJson;
	}
}
