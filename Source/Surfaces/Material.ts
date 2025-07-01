
class Material implements Serializable<Material>
{
	name: string;
	color: Color;
	optics: Material_Optics;
	textures: Texture[];

	constructor
	(
		name: string,
		color: Color,
		optics: Material_Optics,
		textures: Texture[]
	)
	{
		this.name = name;
		this.color = color;
		this.optics = optics;
		this.textures = textures;
	}

	static fromNameAndColor(name: string, color: Color): Material
	{
		return new Material(name, color, Material_Optics.zeroes(), []);
	}

	static fromNameColorOpticsAndTextures
	(
		name: string,
		color: Color,
		optics: Material_Optics,
		textures: Texture[]
	)
	{
		return new Material
		(
			name, color, optics, textures
		);
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
			this.optics.clone(),
			this.textures.map(x => x.clone())
		);
	}

	overwriteWith(other: Material): Material
	{
		this.name = other.name;
		this.color.overwriteWith(other.color);
		this.optics.overwriteWith(other.optics);

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

	prototypesSet() : Material
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;
		typeSetOnObject(Color, this.color);
		this.textures.forEach(x => typeSetOnObject(Texture, x) );
		return this;
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	toObjectSerializable(): any
	{
		var thisAsObject =
		{
			"name": this.name,
			"color": this.color.toObjectSerializable(),
			"optics": this.optics,
			"textures": this.textures
		};

		return thisAsObject;
	}

}

class Material_Instances
{
	Green: Material;
	White: Material;

	constructor()
	{
		var colors = Color.Instances();
		var m =
			(n: string, c: Color, o: Material_Optics, t: Texture[]) =>
				Material.fromNameColorOpticsAndTextures(n, c, o, t); 
		var mo =
			(a: number, d: number, sp: number, sh: number) =>
				Material_Optics.fromAmbientDiffuseSpecularAndShininess
				(
					a, d, sp, sh
				);

		this.Green = m("Green", colors.Green, mo(1, 1, .2, 0), []);
		this.White = m("White", colors.White, mo(1, 1, .2, 0), []);
	}
}

class Material_Optics
{
	ambient: number;
	diffuse: number;
	specular: number;
	shininess: number;

	constructor
	(
		ambient: number,
		diffuse: number,
		specular: number,
		shininess: number
	)
	{
		this.ambient = ambient;
		this.diffuse = diffuse;
		this.specular = specular;
		this.shininess = shininess;
	}

	static fromAmbientDiffuseSpecularAndShininess
	(
		ambient: number,
		diffuse: number,
		specular: number,
		shininess: number
	): Material_Optics
	{
		return new Material_Optics
		(
			ambient, diffuse, specular, shininess
		);
	}

	static zeroes(): Material_Optics
	{
		return Material_Optics.fromAmbientDiffuseSpecularAndShininess
		(
			0, 0, 0, 0
		);
	}

	// Clonable.

	clone(): Material_Optics
	{
		return new Material_Optics
		(
			this.ambient,
			this.diffuse,
			this.specular,
			this.shininess
		);
	}

	overwriteWith(other: Material_Optics): Material_Optics
	{
		this.ambient = other.ambient;
		this.diffuse = other.diffuse;
		this.specular = other.specular;
		this.shininess = other.shininess;
		return this;
	}
}
