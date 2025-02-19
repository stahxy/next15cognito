// app/(auth)/login/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./components/login-form";

export default async function LoginPage() {
	const session = await getSession();

	if (session) {
		redirect("/dashboard");
	}

	return <LoginForm />;
}
