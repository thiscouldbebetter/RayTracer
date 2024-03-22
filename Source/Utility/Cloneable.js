
class Cloneable
{
	static cloneMany(cloneablesToClone)
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

	static overwriteManyWithOthers(cloneablesToOverwrite, cloneablesToOverwriteWith)
	{
		for (var i = 0; i < cloneablesToClone.length; i++)
		{
			cloneablesToOverwrite[i].overwriteWith
			(
				cloneablesToOverwriteWith[i]
			);
		}
	}
}
