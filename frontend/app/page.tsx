import Link from "next/link";

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
			<div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
				<h1 className="text-3xl font-semibold text-slate-950">Todo List</h1>
				<p className="text-base text-slate-600">할 일을 확인하고 완료 상태를 관리하세요.</p>
				<Link
					href="/todos"
					className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
				>
					Open todos
				</Link>
			</div>
		</main>
	);
}
