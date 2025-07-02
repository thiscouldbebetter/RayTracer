
class CollisionGroup
{
	collisions: Collision[];

	constructor(collisions: Collision[])
	{
		this.collisions = collisions;
	}

	static create(): CollisionGroup
	{
		return new CollisionGroup([]);
	}

	clear(): CollisionGroup
	{
		this.collisions.length = 0;
		return this;
	}

	collisionAdd(collisionToAdd: Collision): CollisionGroup
	{
		this.collisions.push(collisionToAdd);
		return this;
	}

	collisionClosest(): Collision
	{
		return Collision.closestOf(this.collisions);
	}

	hasCollisions(): boolean
	{
		return (this.collisions.length > 0);
	}
}