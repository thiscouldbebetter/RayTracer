
class Texture implements Serializable<Texture>
{
	name: string;
	image: Image2;

	_graphics: any;

	constructor
	(
		name: string,
		image: Image2
	)
	{
		this.name = name;
		this.image = image;
	}

	colorSetFromUV(texelColor: Color, texelUV: Coords): Color
	{
		var imageSizeInPixels = this.image.sizeInPixels;

		var g = this.graphics();

		var texelColorComponents = g.getImageData
		(
			texelUV.x * imageSizeInPixels.x, 
			texelUV.y * imageSizeInPixels.y,
			1, 1
		).data;

		texelColor.components
		(
			texelColorComponents[0] / Color.ComponentMax, 
			texelColorComponents[1] / Color.ComponentMax, 
			texelColorComponents[2] / Color.ComponentMax, 
			1 // alpha
		);

		return texelColor;
	}

	graphics(): any
	{
		if (this._graphics == null)
		{
			var canvas = document.createElement("canvas");
			this._graphics =
				canvas.getContext("2d", { willReadFrequently: true} );
		}
		return this._graphics;
	}

	loadAndSendToCallback(callback: any): void
	{
		var texture = this;
		var g = this.graphics();
		this.image.systemImageSendToCallback
		(
			(systemImage: any) =>
			{
				g.drawImage(systemImage, 0, 0);
				callback(texture);
			}
		);
	}

	// Serializable.

	fromJson(objectAsJson: string): Texture
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Texture
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		typeSetOnObject(Image2, this.image);

		return this;
	}
}
