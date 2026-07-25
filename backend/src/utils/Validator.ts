class Validator {
	static isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	static isStrongPassword(password) {
		// Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
		return passwordRegex.test(password);
	}

	static isPositiveNumber(value) {
		return typeof value === "number" && value > 0;
	}

	static isNonNegativeNumber(value) {
		return typeof value === "number" && value >= 0;
	}

	static isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch (error) {
			return false;
		}
	}

	static isNonEmptyString(value) {
		return typeof value === "string" && value.trim().length > 0;
	}

	static isValidId(id) {
		return Number.isInteger(id) && id > 0;
	}
}

module.exports = Validator;