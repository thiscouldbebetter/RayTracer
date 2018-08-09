
function Display()
{}
{
	// static variables

	Display.Collisions = [];
	Display.DirectionFromEyeToPixel = new Coords();
	Display.DisplacementFromEyeToPixel = new Coords();
	Display.Material = new Material("DisplayMaterial", Color.blank("MaterialColor"));
	Display.PixelColor = Color.blank("PixelColor");
	Display.SurfaceNormal = new Coords();
	Display.TexelColor = Color.blank("TexelColor");
	Display.TexelUV = new Coords();
	Display.VertexWeightsAtSurfacePos = [];

	// instance methods

	Display.prototype.drawScene = function(scene)
	{
		this.drawScene_Background(scene);

		var boundsForTiles = [];

		var sizeInTiles = new Coords(1, 1);
		var tileSizeInPixels = this.sizeInPixels.clone().divide
		(
			sizeInTiles
		);

		var tilePosInTiles = new Coords();
	 	var tileBounds = new Bounds
		(
			new Coords(),
			new Coords()
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

	Display.prototype.drawScene_Background = function(scene)
	{
		this.graphics.fillStyle = scene.backgroundColor.systemColor();
		this.graphics.fillRect
		(
			0, 0, 
			this.sizeInPixels.x,
			this.sizeInPixels.y
		);
	}

	Display.prototype.drawScene_PixelsGetAndDrawForBounds = function(scene, bounds)
	{
		// todo
		// It's currently impossible to use DOM objects,
		// including Canvas and GraphicsContext objects,
		// within a web worker. Hopefully this will 
		// change in the future.

		var returnValues = [];
		
		var pixelPos = new Coords();
		var pixelColor = Display.PixelColor;

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

	Display.prototype.drawScene_ColorSetFromPixelAtPos = function
	(
		scene,
		surfaceColor,
		pixelPos
	)
	{
		var collisionClosest = this.drawScene_Pixel_FindClosestCollision
		(
			scene,
			pixelPos
		);	

		if (collisionClosest != null)
		{	
			var collidable = collisionClosest.colliders["Collidable"];

			var surfaceNormal = Display.SurfaceNormal;
			var surfaceMaterial = Display.Material;

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

	Display.prototype.drawScene_Pixel_FindClosestCollision = function
	(
		scene,
		pixelPos
	)
	{
		var camera = scene.camera;
		var cameraOrientation = camera.orientation;

		var displacementFromEyeToPixel = Display.DisplacementFromEyeToPixel;
		var cameraOrientationTemp = Orientation.Instances.Camera;
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

		var directionFromEyeToPixel = Display.DirectionFromEyeToPixel;
		directionFromEyeToPixel.overwriteWith
		(
			displacementFromEyeToPixel
		).normalize();

		var rayFromEyeToPixel = new Ray
		(
			camera.pos,
			directionFromEyeToPixel
		);		

		var collisions = Display.Collisions;
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

	Display.prototype.initialize = function(sizeInPixels)
	{
		this.sizeInPixels = sizeInPixels;
		this.sizeInPixelsHalf = this.sizeInPixels.clone().divideScalar(2);

		var canvas = document.createElement("canvas");
		canvas.width = this.sizeInPixels.x;
		canvas.height = this.sizeInPixels.y;
		document.body.appendChild(canvas);

		this.graphics = canvas.getContext("2d");
	}
}
