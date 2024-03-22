
class Cloneable
{
	static cloneMany(cloneablesToClone: any[]): any[]
	{
		var returnValues = [];

		for (var i = 0; i < cloneablesToClone.length; i++)
		{
			returnValues.push
			(
				cloneablesToClone[i].clone()
			);
		}

		return returnValues;
	}

	static overwriteManyWithOthers
	(
		cloneablesToOverwrite: any[],
		cloneablesToOverwriteWith: any[]
	): any[]
	{
		for (var i = 0; i < cloneablesToOverwrite.length; i++)
		{
			cloneablesToOverwrite[i].overwriteWith
			(
				cloneablesToOverwriteWith[i]
			);
		}

		return cloneablesToOverwriteWith;
	}
}
