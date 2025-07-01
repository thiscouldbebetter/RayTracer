
class SceneRenderer
{
	lightingIsEnabled: boolean;
	shadowsAreEnabled: boolean; // todo
	texturesAreEnabled: boolean;
	renderToBufferFirst: boolean;

	constructor
	(
		lightingIsEnabled: boolean,
		shadowsAreEnabled: boolean,
		texturesAreEnabled: boolean,
		renderToBufferFirst: boolean
	)
	{
		this.lightingIsEnabled = lightingIsEnabled;
		this.shadowsAreEnabled = shadowsAreEnabled;
		this.texturesAreEnabled = texturesAreEnabled;
		this.renderToBufferFirst = renderToBufferFirst;
	}

	static minimal(): SceneRenderer
	{
		return new SceneRenderer(false, false, false, false);
	}

	static maximal(): SceneRenderer
	{
		return new SceneRenderer(true, true, true, false); // todo - Enable renderToBufferFirst.
	}

	// Drawing.

	_collisions: Collision[];
	_directionFromEyeToPixel: Coords;
	_displacementFromEyeToPixel: Coords;
	_material: Material;
	_pixelColor: Color;
	_pixelPosAbsolute: Coords;
	_surfaceNormal: Coords;
	_texelColor: Color;
	_texelUV: Coords;
	_vertexWeightsAtSurfacePos: any[];

	sceneRender(scene: Scene): void
	{
		var displaySize = scene.camera.viewSize;

		var displayToRenderToFirst =
			this.renderToBufferFirst
			? new DisplayBuffer(displaySize)
			: new DisplayGraphics(displaySize);

		var timeBeforeRender = new Date();

		scene.loadForRendererAndSendToCallback
		(
			this,
			(sceneLoaded: Scene) =>
			{
				this.sceneRender_SceneLoaded
				(
					sceneLoaded,
					this, // sceneRender
					displayToRenderToFirst,
					timeBeforeRender
				);
			}
		)
	}

	sceneRender_SceneLoaded
	(
		sceneLoaded: Scene,
		sceneRenderer: SceneRenderer,
		displayToRenderToFirst: Display,
		timeBeforeRender: Date
	): void
	{
		sceneRenderer.drawSceneToDisplay
		(
			sceneLoaded,
			displayToRenderToFirst
		);

		if (this.renderToBufferFirst)
		{
			var displayFinal =
				new DisplayGraphics(sceneLoaded.camera.viewSize);

			displayToRenderToFirst.drawToOther(displayFinal);
		}

		var timeAfterRender = new Date();
		var renderTimeInMilliseconds =
			timeAfterRender.valueOf()
			- timeBeforeRender.valueOf();
		console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
	}

	drawSceneToDisplay(scene: Scene, display: Display): void
	{
		this.drawSceneToDisplay_InitializeTemporaryVariables();

		this.drawSceneToDisplay_Background(scene, display);

		var sizeInTiles = Coords.fromXY(1, 1);
		var tileSizeInPixels =
			display.sizeInPixels
				.clone()
				.divide(sizeInTiles);

		var tilePosInTiles = Coords.create();
	 	var tileBounds = Bounds.create();

		for (var y = 0; y < sizeInTiles.y; y++)
		{
			tilePosInTiles.y = y;

			for (var x = 0; x < sizeInTiles.x; x++)
			{
				tilePosInTiles.x = x;

				this.drawSceneToDisplay_ForTilePosAndBounds
				(
					scene,
					display,
					tileSizeInPixels,
					tilePosInTiles,
					tileBounds
				);
			}
		}
	}

	drawSceneToDisplay_ForTilePosAndBounds
	(
		scene: Scene,
		display: Display,
		tileSizeInPixels: Coords,
		tilePosInTiles: Coords,
		tileBounds: Bounds
	): void
	{
		tileBounds.min
			.overwriteWith(tilePosInTiles)
			.multiply(tileSizeInPixels);

		tileBounds.max
			.overwriteWith(tileBounds.min)
			.add(tileSizeInPixels);

		this.drawSceneToDisplay_PixelsGetAndDrawForBounds
		(
			scene, display, tileBounds
		);
	}

	drawSceneToDisplay_InitializeTemporaryVariables(): void
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
		this._pixelPosAbsolute = Coords.create();
		this._surfaceNormal = Coords.create();
		this._texelColor = Color.blank("TexelColor");
		this._texelUV = Coords.create();
		this._vertexWeightsAtSurfacePos = [];

	}

	drawSceneToDisplay_Background(scene: Scene, display: Display): void
	{
		display.fillWithColor(scene.backgroundColor);
	}

	drawSceneToDisplay_PixelsGetAndDrawForBounds
	(
		scene: Scene, display: Display, bounds: Bounds
	): void
	{
		var boundsMin = bounds.min;
		var boundsMax = bounds.max;

		var pane = new Pane(boundsMin, boundsMax);

		pane.drawSceneForRenderer(scene, this);

		pane.drawToDisplay(display);
	}


	drawSceneToDisplay_DrawToPaneAtPixelPosRelative
	(
		scene: Scene,
		pane: Pane,
		pixelPosRelativeToPane: Coords
	): void
	{
		var pixelPosAbsolute =
			this._pixelPosAbsolute
				.overwriteWith(pixelPosRelativeToPane)
				.add(pane.boundsMin);

		var collisions =
			this.drawSceneToDisplay_Pixel_FindCollisions
			(
				scene,
				pixelPosAbsolute
			);

		var collision = Collision.closestOf(collisions);

		if (collisions.length > 0)
		{
			var shape =
				collision.shapeCollidingFinal();

			var surfaceNormal = this._surfaceNormal;
			var surfaceColor = this._pixelColor;
			var surfaceMaterial = this._material;

			shape.surfaceMaterialColorAndNormalForCollision
			(
				scene,
				collision,
				surfaceMaterial,
				surfaceColor,
				surfaceNormal
			);

			var intensityFromLightsAll =
				this.intensityFromLightsAll
				(
					collision,
					surfaceMaterial,
					surfaceNormal,
					scene
				);

			surfaceColor.multiply(intensityFromLightsAll);

			pane.pixelAtPosRelativeSetToColor
			(
				pixelPosRelativeToPane, surfaceColor
			);
		}
	}

	drawSceneToDisplay_Pixel_FindCollisions
	(
		scene: Scene, pixelPos: Coords
	): Collision[]
	{
		var camera = scene.camera;

		var rayFromCameraToPixel =
			camera.rayToPixelAtPos(pixelPos);

		var collisions = this._collisions;
		collisions.length = 0;

		collisions = scene.collisionsOfRayWithObjectsMinusExceptionAddToList
		(
			rayFromCameraToPixel,
			null, // objectToExcept
			collisions
		);

		return collisions;
	}

	intensityFromLightsAll
	(
		collisionClosest: Collision,
		surfaceMaterial: Material,
		surfaceNormal: Coords,
		scene: Scene
	): number
	{
		var intensityFromLightsAll = 0;

		if (this.lightingIsEnabled == false)
		{
			intensityFromLightsAll = 1;
		}
		else
		{
			var lights = scene.lighting.lights;

			for (var i = 0; i < lights.length; i++)
			{
				var light = lights[i];

				var intensity =
					light.intensityForCollisionMaterialNormalAndCamera
					(
						collisionClosest,
						surfaceMaterial,
						surfaceNormal,
						scene.camera,
						this,
						scene
					);

				intensityFromLightsAll += intensity;
			}
		}

		return intensityFromLightsAll;
	}
}