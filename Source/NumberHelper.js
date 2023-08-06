
class NumberHelper
{
	static wrapValueToRange(valueToWrap, range)
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
