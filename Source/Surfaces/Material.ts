
class Material implements Serializable<Material>
{
	name: string;
	color: Color;
	ambient: number;
	diffuse: number;
	specular: number;
	shininess: number;
	textures: Texture[];

	constructor
	(
		name: string,
		color: Color,
		ambient: number,
		diffuse: number,
		specular: number,
		shininess: number,
		textures: Texture[]
	)
	{
		this.name = name;
		this.color = color;
		this.ambient = ambient;
		this.diffuse = diffuse;
		this.specular = specular;
		this.shininess = shininess;
		this.textures = textures;
	}

	static fromNameAndColor(name: string, color: Color): Material
	{
		return new Material(name, color, 0, 0, 0, 0, []);
	}

	// instances

	static _instances: Material_Instances;
	static Instances(): Material_Instances
	{
		if (Material._instances == null)
		{
			Material._instances = new Material_Instances();
		}
		return Material._instances;
	}

	// methods

	colorSetFromUv(color: Color, textureUv: Coords): Color
	{
		color.overwriteWith(this.color);
		for (var t = 0; t < this.textures.length; t++)
		{
			var texture = this.textures[t];
			texture.colorSetFromUv(color, textureUv);
			break; // todo
		}
		return color;
	}

	loadAndSendToCallback(callback: (m: Material) => void): void
	{
		var material = this;

		if (this.textures.length == 0)
		{
			callback(material);
		}
		else
		{
			this.textures.forEach
			(
				textureToLoad =>
				{
					textureToLoad.loadAndSendToCallback
					(
						() =>
						{
							if (material.texturesAreAllLoaded() )
							{
								callback(material);
							}
						}
					);
				}
			);
		}
	}

	texturesAreAllLoaded(): boolean
	{
		var someTextureIsNotLoaded =
			this.textures.some(x => x.loaded() == false);
		var allTexturesAreLoaded =
			(someTextureIsNotLoaded == false);
		return allTexturesAreLoaded;
	}

	// cloneable

	clone(): Material
	{
		return new Material
		(
			this.name,
			this.color.clone(),
			this.ambient,
			this.diffuse,
			this.specular,
			this.shininess,
			this.textures.map(x => x.clone())
		);
	}

	overwriteWith(other: Material): Material
	{
		this.name = other.name;
		this.color.overwriteWith(other.color);
		this.ambient = other.ambient;
		this.diffuse = other.diffuse;
		this.specular = other.specular;
		this.shininess = other.shininess;

		this.textures.length = other.textures.length;
		for (var i = 0; i < this.textures.length; i++)
		{
			this.textures[i] = other.textures[i];
		}

		return this;
	}

	// Serializable.

	fromJson(objectAsJson: string): Material
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet() : Material
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;
		typeSetOnObject(Color, this.color);
		this.textures.forEach(x => typeSetOnObject(Texture, x) );
		return this;
	}
}

class Material_Instances
{
	Green: Material;
	White: Material;

	constructor()
	{
		var colors = Color.Instances();
		this.Green = new Material("Green", colors.Green, 1, 1, .2, 0, []);
		this.White = new Material("White", colors.White, 1, 1, .2, 0, []);
	}
}
