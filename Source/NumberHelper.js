
function NumberHelper()
{
	// static class
}

{
	NumberHelper.wrapValueToRange = function(valueToWrap, range)
	{
		while (valueToWrap < 0)
		{
			valueToWrap += range;
		}

		while (valueToWrap >= range)
		{
			valueToWrap -= range;
		}

		return valueToWrap;
	}
}
