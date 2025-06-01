
class DisplayBuffer implements Display
{
	sizeInPixels: Coords;

	pixelsAsComponentsRgb: number[];

	constructor(sizeInPixels: Coords)
	{
		this.sizeInPixels = sizeInPixels;

		this.pixelsAsComponentsRgb = [];
	}

	// Drawing.

	fillWithColor(color: Color): void
	{
		var pixelPos = Coords.zeroes();

		for (var y = 0; y < this.sizeInPixels.y; y++)
		{
			pixelPos.y = y;

			for (var x = 0; x < this.sizeInPixels.x; x++)
			{
				pixelPos.x = x;

				this.pixelAtPosSetToColor(pixelPos, color);
			}
		}
	}

	pixelAtPosSetToColor(pixelPos: Coords, pixelColor: Color): void
	{
		var colorToWriteAsComponentsRgb =
			pixelColor.componentsRGBA;

		var componentsPerColor = 3;
		var componentFirstIndex =
			pixelPos.y * componentsPerColor + pixelPos.x;

		for (var i = 0; i < componentsPerColor; i++)
		{
			var componentToWrite =
				colorToWriteAsComponentsRgb[i];

			var componentIndex =
				componentFirstIndex + i;

			this.pixelsAsComponentsRgb[componentIndex] =
				componentToWrite;
		}
	}

	pixelAtPosWriteToColor(pixelPos: Coords, colorToOverwrite: Color): Color
	{
		var componentsPerColor = 3;
		var componentFirstIndex =
			pixelPos.y * componentsPerColor + pixelPos.x;

		for (var i = 0; i < componentsPerColor; i++)
		{
			var componentIndex = componentFirstIndex + i;
			var componentRead =
				this.pixelsAsComponentsRgb[componentIndex];

			colorToOverwrite.componentAtIndexSetTo(i, componentRead);
		}

		return colorToOverwrite;
	}

	renderToDisplayOther(displayToRenderTo: Display): void
	{
		var pixelPos = Coords.zeroes();
		var pixelColor = Color.create();

		var sizeInPixels = this.sizeInPixels;

		for (var y = 0; y < sizeInPixels.y; y++)
		{
			pixelPos.y = y;

			for (var x = 0; x < sizeInPixels.x; x++)
			{
				pixelPos.x = x;

				var pixelColor =
					this.pixelAtPosWriteToColor(pixelPos, pixelColor);

				displayToRenderTo.pixelAtPosSetToColor(pixelPos, pixelColor);
			}
		}
	}
}
