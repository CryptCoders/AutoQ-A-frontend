const toBoldUnicode = (text) => {
	return Array.from(text, char => {
		const codePoint = char.codePointAt(0);
		if (codePoint >= 0x61 && codePoint <= 0x7A) {
			return String.fromCodePoint(codePoint + 0x1D400 - 0x61); // lowercase
		} else if (codePoint >= 0x41 && codePoint <= 0x5A) {
			return String.fromCodePoint(codePoint + 0x1D400 - 0x41); // uppercase
		} else {
			return char; // return as-is
		}
	}).join('');
}
export const formatQuestion = (question) => {
	question = question.replaceAll(/\*\*[a-zA-Z ]*:\*\*/g, "");
	question = question.replaceAll(/[0-9]*\./g, "");
	return question;
};

export const formatAnswer = (answer) => {
	answer = answer.replaceAll(/\*\*(.*?)\*\*/g, (match, group) => {
		return toBoldUnicode(group);
	});

	return answer;
};