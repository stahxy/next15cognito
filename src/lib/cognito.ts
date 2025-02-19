import {
	CognitoUserPool,
	CognitoUser,
	AuthenticationDetails,
	CognitoRefreshToken,
	CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const poolData = {
	UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
	ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export const signUpUser = (
	username: string,
	password: string,
	email: string
): Promise<any> => {
	return new Promise((resolve, reject) => {
		const attributeList: CognitoUserAttribute[] = [
			new CognitoUserAttribute({ Name: "email", Value: email }),
		];

		userPool.signUp(
			username,
			password,
			attributeList,
			[],
			(err, result) => {
				if (err) {
					console.error("Error al registrar el usuario:", err);
					reject(err);
				} else {
					console.log("Usuario registrado con éxito:", result);
					resolve(result);
				}
			}
		);
	});
};

export const authenticateUser = (username: string, password: string) => {
	const authDetails = new AuthenticationDetails({
		Username: username,
		Password: password,
	});

	const cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});

	return new Promise((resolve, reject) => {
		cognitoUser.authenticateUser(authDetails, {
			onSuccess: (session) => resolve(session),
			onFailure: (err) => reject(err),
		});
	});
};

export const refreshToken = (refreshToken: string) => {
	const cognitoUser = userPool.getCurrentUser();

	if (!cognitoUser) {
		throw new Error("No user found");
	}

	return new Promise((resolve, reject) => {
		cognitoUser.refreshSession(
			new CognitoRefreshToken({ RefreshToken: refreshToken }),
			(err, session) => {
				if (err) {
					reject(err);
				} else {
					resolve(session);
				}
			}
		);
	});
};
