
class SceneRenderer
{
	lightingIsEnabled: boolean;
	shadowsAreEnabled: boolean;
	texturesAreEnabled: boolean;
	transparencyIsEnabled: boolean;
	renderToBufferFirst: boolean;

	constructor
	(
		lightingIsEnabled: boolean,
		shadowsAreEnabled: boolean,
		texturesAreEnabled: boolean,
		transparencyIsEnabled: boolean,
		renderToBufferFirst: boolean
	)
	{
		this.lightingIsEnabled = lightingIsEnabled;
		this.shadowsAreEnabled = shadowsAreEnabled;
		this.texturesAreEnabled = texturesAreEnabled;
		this.transparencyIsEnabled = transparencyIsEnabled;
		this.renderToBufferFirst = renderToBufferFirst;
	}

	static minimal(): SceneRenderer
	{
		return new SceneRenderer(false, false, false, false, false);
	}

	static maximal(): SceneRenderer
	{
		return new SceneRenderer(true, true, true, true, false); // todo - Enable renderToBufferFirst.
	}

	// Drawing.

	_collisions: Collision[];
	_directionFromEyeToPixel: Coords;
	_displacementFromEyeToPixel: Coords;
	_pixelColor: Color;
	_pixelPosAbsolute: Coords;
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
		sceneRenderer.sceneDrawToDisplay
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

	sceneDrawToDisplay(scene: Scene, display: Display): void
	{
		this.sceneDrawToDisplay_InitializeTemporaryVariables();

		this.sceneDrawToDisplay_Background(scene, display);

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

				this.sceneDrawToDisplay_ForTilePosAndBounds
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

	sceneDrawToDisplay_ForTilePosAndBounds
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

		this.sceneDrawToDisplay_PixelsGetAndDrawForBounds
		(
			scene, display, tileBounds
		);
	}

	sceneDrawToDisplay_InitializeTemporaryVariables(): void
	{
		this._collisions = [];
		this._directionFromEyeToPixel = Coords.create();
		this._displacementFromEyeToPixel = Coords.create();
		this._pixelColor = Color.blank("PixelColor");
		this._pixelPosAbsolute = Coords.create();
		this._texelColor = Color.blank("TexelColor");
		this._texelUV = Coords.create();
		this._vertexWeightsAtSurfacePos = [];
	}

	sceneDrawToDisplay_Background(scene: Scene, display: Display): void
	{
		display.fillWithColor(scene.backgroundColor);
	}

	sceneDrawToDisplay_PixelsGetAndDrawForBounds
	(
		scene: Scene, display: Display, bounds: Bounds
	): void
	{
		var pane = Pane.fromBounds(bounds);

		pane.sceneDrawForRenderer(scene, this);

		pane.drawToDisplay(display);
	}

	sceneDrawToPaneAtPixelPosRelative
	(
		scene: Scene,
		pane: Pane,
		pixelPosRelativeToPane: Coords
	): void
	{
		var pixelPosAbsolute =
			this._pixelPosAbsolute
				.overwriteWith(pixelPosRelativeToPane)
				.add(pane.bounds.min);

		var collisions =
			this.collisionsFindOfSceneWithRayFromCameraToPixelPos
			(
				scene,
				pixelPosAbsolute
			);

		var collision = Collision.closestOf(collisions);

		if (collisions.length > 0)
		{
			var shape =
				collision.shapeCollidingFinal();

			shape.surfaceMaterialColorAndNormalForCollision
			(
				scene,
				collision
			);

			var intensityFromLightsAll =
				this.intensityFromLightsAll
				(
					collision,
					scene
				);

			var pixelColor =
				this._pixelColor
					.overwriteWith(collision.surfaceColor)
					.multiply(intensityFromLightsAll);

			pane.pixelAtPosRelativeSetToColor
			(
				pixelPosRelativeToPane,
				pixelColor
			);
		}
	}

	collisionsFindOfSceneWithRayFromCameraToPixelPos
	(
		scene: Scene,
		pixelPos: Coords
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
		collision: Collision,
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
					light.intensityForCollisionAndCamera
					(
						collision,
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