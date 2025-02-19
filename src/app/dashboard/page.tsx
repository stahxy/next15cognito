// app/dashboard/page.tsx
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await getSession();

	if (!session) {
		return <p>No autorizado</p>;
	}

	return (
		<div>
			<h1>Bienvenido, {session.user.username}</h1>
		</div>
	);
}
