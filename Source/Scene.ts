
class Scene
{
	name: string;
	materials: Material[];
	backgroundColor: Color;
	lighting: Lighting;
	camera: Camera;
	collidables: any[];

	_materialsByName: Map<string, Material>;

	constructor
	(
		name: string,
		materials: Material[],
		backgroundColor: Color,
		lighting: Lighting,
		camera: Camera,
		collidables: any[]
	)
	{
		this.name = name;
		this.materials = materials;
		this.backgroundColor = backgroundColor;
		this.lighting = lighting;
		this.camera = camera;
		this.collidables = collidables;

		this._materialsByName =
			new Map(this.materials.map(x => [x.name, x]) );
	}

	materialByName(name: string): Material
	{
		return this._materialsByName.get(name);
	}
}
