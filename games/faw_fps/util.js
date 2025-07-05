
function mat(A, n = 4) {

	return function (x) {

		let vec = x.slice(0, n);
		while (vec.length < n)
			vec.push(0);

		let result = new Array(n).fill(0);
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++)
				result[i] += A[i * n + j] * vec[j];
		}

		return result;
	};

}

function mult(A, B) {
	return function(x) {
		return A(B(x));
	}
}

