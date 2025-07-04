
class Texture implements Serializable<Texture>
{
	name: string;
	image: Image2;

	_loaded: boolean;

	_graphics: any;

	constructor
	(
		name: string,
		image: Image2
	)
	{
		this.name = name;
		this.image = image;

		this._loaded = false;
	}

	static fromNameAndImage
	(
		name: string,
		image: Image2
	)
	{
		return new Texture(name, image);
	}

	colorSetFromUv(texelColor: Color, texelUV: Coords): Color
	{
		var imageSizeInPixels = this.image.sizeInPixels();

		var g = this.graphics();

		var texelColorComponents = g.getImageData
		(
			texelUV.x * imageSizeInPixels.x, 
			texelUV.y * imageSizeInPixels.y,
			1, 1
		).data;

		texelColor.componentsRGBASet
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
				texture._loaded = true;
				callback(texture);
			}
		);
	}

	loaded(): boolean
	{
		return this._loaded;
	}

	// Clonable.

	clone(): Texture
	{
		return Texture.fromNameAndImage
		(
			this.name,
			this.image
		);
	}

	overwriteWith(other: Texture): Texture
	{
		this.name = other.name;
		this.image = other.image;
		return this;
	}

	// Serializable.

	fromJson(objectAsJson: string): Texture
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Texture
	{
		ImageHelper.imageTypeSet(this.image);

		return this;
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	toObjectSerializable(): any
	{
		return this;
	}
}
