
class Texture
{
	name: string;
	image: Image2;

	graphics: any;

	constructor
	(
		name: string,
		image: Image2
	)
	{
		this.name = name;
		this.image = image;

		var canvas = document.createElement("canvas");
		this.graphics = canvas.getContext("2d", { willReadFrequently: true} );
	}

	colorSetFromUV(texelColor: Color, texelUV: Coords): Color
	{
		var imageSizeInPixels = this.image.sizeInPixels;

		var texelColorComponents = this.graphics.getImageData
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

	loadAndSendToCallback(callback: any): void
	{
		var texture = this;
		var g = this.graphics;
		this.image.systemImageSendToCallback
		(
			(systemImage: any) =>
			{
				g.drawImage(systemImage, 0, 0);
				callback(texture);
			}
		);
	}
}
