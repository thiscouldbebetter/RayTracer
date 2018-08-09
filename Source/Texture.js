
function Texture(name, image)
{
	this.name = name;
	this.image = image;
	
	var canvas = document.createElement("canvas");
	this.graphics = canvas.getContext("2d");
	this.graphics.drawImage(this.image.systemImage(), 0, 0);
}

{
	Texture.prototype.colorSetFromUV = function(texelColor, texelUV)
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
	}
}
