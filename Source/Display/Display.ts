
class Display
{
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;

	graphics: any;

	Collisions: Collision[];
	DirectionFromEyeToPixel: Coords;
	DisplacementFromEyeToPixel: Coords;
	Material: Material;
	PixelColor: Color;
	SurfaceNormal: Coords;
	TexelColor: Color;
	TexelUV: Coords;
	VertexWeightsAtSurfacePos: any[];

	constructor()
	{
		this.Collisions = [];
		this.DirectionFromEyeToPixel = Coords.create();
		this.DisplacementFromEyeToPixel = Coords.create();
		this.Material = Material.fromNameAndColor
		(
			"DisplayMaterial",
			Color.blank("MaterialColor")
		);
		this.PixelColor = Color.blank("PixelColor");
		this.SurfaceNormal = Coords.create();
		this.TexelColor = Color.blank("TexelColor");
		this.TexelUV = Coords.create();
		this.VertexWeightsAtSurfacePos = [];
	}

	// instance methods

	drawScene(scene: Scene): void
	{
		this.drawScene_Background(scene);

		var sizeInTiles = Coords.fromXY(1, 1);
		var tileSizeInPixels = this.sizeInPixels.clone().divide
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

				this.drawScene_PixelsGetAndDrawForBounds
				(
					scene, tileBounds
				);
			}
		}
	}

	drawScene_Background(scene: Scene): void
	{
		this.graphics.fillStyle = scene.backgroundColor.systemColor();
		this.graphics.fillRect
		(
			0, 0, 
			this.sizeInPixels.x,
			this.sizeInPixels.y
		);
	}

	drawScene_PixelsGetAndDrawForBounds(scene: Scene, bounds: Bounds): void
	{
		// todo
		// It's currently impossible to use DOM objects,
		// including Canvas and GraphicsContext objects,
		// within a web worker. Hopefully this will 
		// change in the future.

		var pixelPos = Coords.create();
		var pixelColor = this.PixelColor;

		var boundsMin = bounds.min;
		var boundsMax = bounds.max;

		var sceneBackgroundColor = scene.backgroundColor;

		for (var y = boundsMin.y; y < boundsMax.y; y++)
		{
			pixelPos.y = y;

			for (var x = boundsMin.x; x < boundsMax.x; x++)
			{
				pixelPos.x = x;

				var collisionForPixel = this.drawScene_ColorSetFromPixelAtPos
				(
					scene,
					pixelColor,
					pixelPos
				);

				if (collisionForPixel == null)
				{
					pixelColor.overwriteWith(sceneBackgroundColor);
				}

				this.graphics.fillStyle = 
					pixelColor.systemColor();

				this.graphics.fillRect
				(
					pixelPos.x, 
					pixelPos.y, 
					1, 1
				);
			}
		}
	}

	drawScene_ColorSetFromPixelAtPos
	(
		scene: Scene,
		surfaceColor: Color,
		pixelPos: Coords
	): Collision
	{
		var collisionClosest = this.drawScene_Pixel_FindClosestCollision
		(
			scene,
			pixelPos
		);

		if (collisionClosest != null)
		{
			var collidable =
				collisionClosest.colliderByName("Collidable");

			var surfaceNormal = this.SurfaceNormal;
			var surfaceMaterial = this.Material;

			collidable.surfaceMaterialColorAndNormalForCollision
			(
				scene,
				collisionClosest,
				surfaceMaterial,
				surfaceColor,
				surfaceNormal
			);

			var intensityFromLightsAll = 0;

			var lights = scene.lighting.lights;

			for (var i = 0; i < lights.length; i++)
			{
				var light = lights[i];

				var intensity = light.intensityForCollisionMaterialNormalAndCamera
				(
					collisionClosest,
					surfaceMaterial,
					surfaceNormal,
					scene.camera
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

	drawScene_Pixel_FindClosestCollision
	(
		scene: Scene,
		pixelPos: Coords
	)
	{
		var camera = scene.camera;
		var cameraOrientation = camera.orientation;

		var displacementFromEyeToPixel = this.DisplacementFromEyeToPixel;
		var cameraOrientationTemp = Orientation.Instances().Camera;
		var cameraForward = cameraOrientationTemp.forward;
		var cameraRight = cameraOrientationTemp.right;
		var cameraDown = cameraOrientationTemp.down;

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
				pixelPos.x - this.sizeInPixelsHalf.x
			)
		).add
		(
			cameraDown.overwriteWith
			(
				cameraOrientation.down
			).multiplyScalar
			(
				pixelPos.y - this.sizeInPixelsHalf.y
			)
		);

		var directionFromEyeToPixel = this.DirectionFromEyeToPixel;
		directionFromEyeToPixel.overwriteWith
		(
			displacementFromEyeToPixel
		).normalize();

		var rayFromEyeToPixel = new Ray
		(
			camera.pos,
			directionFromEyeToPixel
		);

		var collisions = this.Collisions;
		collisions.length = 0;

		for (var i = 0; i < scene.collidables.length; i++)
		{
			var collidable = scene.collidables[i];

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

	initialize(sizeInPixels: Coords): void
	{
		this.sizeInPixels = sizeInPixels;
		this.sizeInPixelsHalf =
			this.sizeInPixels.clone().divideScalar(2);

		var d = document;
		var canvas = d.createElement("canvas");
		canvas.width = this.sizeInPixels.x;
		canvas.height = this.sizeInPixels.y;

		var divDisplay = d.getElementById("divDisplay");
		divDisplay.innerHTML = "";
		divDisplay.appendChild(canvas);

		this.graphics = canvas.getContext("2d");
	}
}
