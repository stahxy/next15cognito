"use client";

import { authenticateUser } from "@/lib/cognito";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { username, password } = e.currentTarget;

		try {
			const session = (await authenticateUser(
				username.value,
				password.value
			)) as CognitoUserSession;

			await fetch("/api/auth/callback", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					accessToken: session.getAccessToken().getJwtToken(),
					refreshToken: session.getRefreshToken().getToken(),
				}),
			});

			router.push("/dashboard");
		} catch (error) {
			console.error("Error de autenticación:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="username" placeholder="Usuario" />
			<input name="password" type="password" placeholder="Contraseña" />
			<button type="submit">Iniciar sesión</button>
		</form>
	);
}
