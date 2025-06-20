
class Pane
{
	boundsMin: Coords;
	boundsMax: Coords;

	sizeInPixels: Coords;

	pixelRows: Color[][];

	_pixelColor: Color;
	_pixelPosAbsolute: Coords;
	_pixelPosRelative: Coords;

	constructor(boundsMin: Coords, boundsMax: Coords)
	{
		this.boundsMin = boundsMin;
		this.boundsMax = boundsMax;

		this.sizeInPixels =
			this.boundsMax.clone().subtract(this.boundsMin);

		this._pixelColor = Color.create();
		this._pixelPosAbsolute = Coords.create();
		this._pixelPosRelative = Coords.create();

		this.pixelRows = [];

		var size = this.sizeInPixels;

		for (var y = 0; y < size.y; y++)
		{
			var pixelRow = [];

			for (var x = 0; x < size.x; x++)
			{
				pixelRow[x] = Color.create();
			}

			this.pixelRows.push(pixelRow);
		}
	}

	drawSceneForRenderer
	(
		scene: Scene,
		sceneRenderer: SceneRenderer
	): void
	{
		var pixelColor = this._pixelColor;

		var paneSize = this.sizeInPixels;
		var boundsMin = this.boundsMin;

		var pixelPosAbsolute = this._pixelPosAbsolute;
		var pixelPosRelative = this._pixelPosRelative;

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
					sceneRenderer.drawSceneToDisplay_ColorSetFromPixelAtPos
					(
						scene,
						pixelColor,
						pixelPosAbsolute
					);

				if (collisionForRayFromCameraToPixel != null)
				{
					this.pixelAtPosRelativeSetToColor
					(
						pixelPosRelative, pixelColor
					);
				}
			}
		}
	}

	drawToDisplay(display: Display): void
	{
		var pixelPosRelative = this._pixelPosRelative;
		var pixelPosAbsolute = this._pixelPosAbsolute;
		var sizeInPixels = this.sizeInPixels;

		for (var y = 0; y < sizeInPixels.y; y++)
		{
			pixelPosRelative.y = y;
			var pixelRow = this.pixelRows[y];

			for (var x = 0; x < sizeInPixels.x; x++)
			{
				pixelPosRelative.x = x;

				pixelPosAbsolute
					.overwriteWith(pixelPosRelative)
					.add(this.boundsMin);

				var pixelColor = pixelRow[x];

				display.pixelAtPosSetToColor(pixelPosAbsolute, pixelColor);
			}
		}
	}

	pixelAtPosRelativeSetToColor(posRelative: Coords, color: Color): void
	{
		var pixelAsColor =
			this.pixelRows[posRelative.y][posRelative.x];
		pixelAsColor.overwriteWith(color);
	}
}