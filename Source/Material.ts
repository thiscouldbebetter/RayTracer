
class Material implements Serializable<Material>
{
	name: string;
	color: Color;
	ambient: number;
	diffuse: number;
	specular: number;
	shininess: number;
	texture: Texture;

	constructor
	(
		name: string,
		color: Color,
		ambient: number,
		diffuse: number,
		specular: number,
		shininess: number,
		texture: Texture
	)
	{
		this.name = name;
		this.color = color;
		this.ambient = ambient;
		this.diffuse = diffuse;
		this.specular = specular;
		this.shininess = shininess;
		this.texture = texture;
	}

	/*
	static create()
	{
		return new Material
		(
			"name",
			Color.create(),
			0, // ambient
			0, // diffuse
			0, // specular
			0, // shininess
			Texture.create()
		);
	}
	*/

	static fromNameAndColor(name: string, color: Color): Material
	{
		return new Material(name, color, 0, 0, 0, 0, null);
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

	loadAndSendToCallback(callback: any): void
	{
		var material = this;
		if (this.texture == null)
		{
			callback(this);
		}
		else
		{
			this.texture.loadAndSendToCallback
			(
				(textureLoaded: Texture) => callback(material)
			);
		}
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
			this.texture
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
		this.texture = other.texture;

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
		if (this.texture != null)
		{
			typeSetOnObject(Texture, this.texture);
		}
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
		this.Green = new Material("Green", colors.Green, 1, 1, .2, 0, null);
		this.White = new Material("White", colors.White, 1, 1, .2, 0, null);
	}
}
