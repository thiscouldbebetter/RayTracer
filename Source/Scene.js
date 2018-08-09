
function Scene(name, materials, backgroundColor, lighting, camera, collidables)
{
	this.name = name;
	this.materials = materials;
	this.backgroundColor = backgroundColor;
	this.lighting = lighting;
	this.camera = camera;
	this.collidables = collidables;

	this.materials.addLookups("name");
}
