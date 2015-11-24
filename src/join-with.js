export default (array, callback) => {
	const result = new Array(array.length * 2 - 1);

	result[0] = array[0];
	for (let index = 1; index < array.length; index++) { // eslint-disable-line no-plusplus
		result[index * 2 - 1] = callback(array[index - 1], array[index], index - 1, array); // eslint-disable-line callback-return
		result[index * 2] = array[index];
	}

	return result;
};
