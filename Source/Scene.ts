
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

	loadAndSendToCallback(callback: any): void
	{
		var materialsCount = this.materials.length;
		var materialsLoadedSoFarCount = 0;
		var scene = this;
		this.materials.forEach
		(
			m => m.loadAndSendToCallback
			(
				(materialLoaded: Material) =>
				{
					materialsLoadedSoFarCount++;
					if (materialsLoadedSoFarCount >= materialsCount)
					{
						callback(scene);
					}
				}
			)
		);
	}

	materialByName(name: string): Material
	{
		return this._materialsByName.get(name);
	}
}
