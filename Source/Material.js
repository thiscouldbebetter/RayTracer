
function Material(name, color, ambient, diffuse, specular, shininess, texture)
{
	this.name = name;
	this.color = color;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
	this.texture = texture;
}

{	
	// instances

	function Material_Instances()
	{
		this.Green = new Material("Green", Color.Instances.Green, 1, 1, .2, 0);
		this.White = new Material("White", Color.Instances.White, 1, 1, .2, 0);
	}

	Material.Instances = new Material_Instances();
	
	// methods

	// cloneable

	Material.prototype.clone = function()
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

	Material.prototype.overwriteWith = function(other)
	{
		this.name = other.name;
		this.color.overwriteWith(other.color);
		this.ambient = other.ambient;
		this.diffuse = other.diffuse;
		this.specular = other.specular;
		this.shininess = other.shininess;
		this.texture = other.texture;
	}
}
