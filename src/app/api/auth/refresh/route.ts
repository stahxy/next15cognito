import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
	CognitoUserPool,
	CognitoUser,
	CognitoRefreshToken,
	CognitoUserSession,
} from "amazon-cognito-identity-js";

const poolData = {
	UserPoolId: process.env.COGNITO_USER_POOL_ID!,
	ClientId: process.env.COGNITO_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export async function POST() {
	const refreshToken = (await cookies()).get("cognito_refresh_token")?.value;

	if (!refreshToken) {
		return NextResponse.json(
			{ error: "No refresh token" },
			{ status: 401 }
		);
	}

	const cognitoUser = userPool.getCurrentUser();

	if (!cognitoUser) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}

	try {
		const session = await new Promise<CognitoUserSession>(
			(resolve, reject) => {
				const RefreshToken = new CognitoRefreshToken({
					RefreshToken: refreshToken,
				});
				cognitoUser.refreshSession(RefreshToken, (err, session) => {
					if (err) reject(err);
					else resolve(session);
				});
			}
		);

		const response = NextResponse.json({ success: true });

		// Establece nuevas cookies
		response.cookies.set(
			"cognito_access_token",
			session.getAccessToken().getJwtToken(),
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: 3600,
			}
		);

		return response;
	} catch (error) {
		return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
	}
}
