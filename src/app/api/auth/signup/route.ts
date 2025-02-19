// app/api/auth/signup/route.ts
import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
	UserPoolId: process.env.COGNITO_USER_POOL_ID!,
	ClientId: process.env.COGNITO_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export async function POST(request: Request) {
	const { username, password, email } = await request.json();

	return new Promise((resolve, reject) => {
		userPool.signUp(
			username,
			password,
			[{ Name: "email", Value: email }],
			null,
			(err, result) => {
				if (err) {
					return resolve(
						new Response(JSON.stringify({ error: err }), {
							status: 400,
						})
					);
				}
				return resolve(
					new Response(JSON.stringify({ success: true }), {
						status: 200,
					})
				);
			}
		);
	});
}
