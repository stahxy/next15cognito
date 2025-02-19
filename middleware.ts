// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("cognito_access_token")?.value;
	const refreshToken = request.cookies.get("cognito_refresh_token")?.value;

	// Si no hay tokens, redirige a login
	if (!accessToken || !refreshToken) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	try {
		const verifier = CognitoJwtVerifier.create({
			userPoolId: process.env.COGNITO_USER_POOL_ID!,
			tokenUse: "access",
			clientId: process.env.COGNITO_CLIENT_ID!,
		});

		await verifier.verify(accessToken);
		return NextResponse.next();
	} catch (error) {
		// Intenta refrescar el token
		const refreshResponse = await fetch(
			`${request.nextUrl.origin}/api/auth/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: request.headers.get("Cookie") || "",
				},
			}
		);

		if (refreshResponse.ok) {
			const newCookies = refreshResponse.headers.getSetCookie();
			const response = NextResponse.next();

			// Actualiza las cookies en la respuesta
			newCookies.forEach((cookie) => {
				response.headers.append("Set-Cookie", cookie);
			});

			return response;
		}

		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
}
