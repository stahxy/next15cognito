// app/lib/auth.ts
import { cookies } from "next/headers";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export async function getSession() {
	const accessToken = (await cookies()).get("cognito_access_token")?.value;
	console.log("accessToken", accessToken);
	if (!accessToken) {
		return null;
	}

	try {
		const verifier = CognitoJwtVerifier.create({
			userPoolId: process.env.COGNITO_USER_POOL_ID!,
			tokenUse: "access",
			clientId: process.env.COGNITO_CLIENT_ID!,
		});

		const payload = await verifier.verify(accessToken);
		console.log("payload", payload);
		return { user: payload };
	} catch (error) {
		return null;
	}
}
