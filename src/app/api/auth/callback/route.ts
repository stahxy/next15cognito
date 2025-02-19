import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
	const { accessToken, refreshToken } = await request.json();

	const response = NextResponse.json({ success: true });

	response.cookies.set("cognito_access_token", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 3600,
	});

	response.cookies.set("cognito_refresh_token", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 30 * 24 * 3600,
	});

	return response;
}
