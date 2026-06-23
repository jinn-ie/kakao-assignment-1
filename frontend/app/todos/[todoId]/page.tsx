import Link from "next/link";

import TodoList from "@/components/TodoList";
import { getTodos } from "@/app/actions";

export default async function TodoEditPage({
	params,
}: {
	params: Promise<{ todoId: string }>;
}) {
	const { todoId } = await params;
	const todos = await getTodos();
	const editingTodoId = Number(todoId);

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-sky-50 to-amber-50 px-4 py-10">
			<section className="flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.14)] backdrop-blur sm:p-8">
				<h1 className="text-center text-3xl font-black tracking-tight text-violet-950 sm:text-4xl">
					Todo List
				</h1>
				<div className="mt-6 rounded-3xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm shadow-violet-100/50">
					<div className="flex justify-center">
					<Link
						href="/todos/new"
							className="inline-flex h-12 items-center justify-center rounded-2xl bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-500"
					>
						+ 투두 추가하기
					</Link>
					</div>
				</div>
				<div className="mt-6 flex-1">
					<TodoList todos={todos} editingTodoId={editingTodoId} />
				</div>
			</section>
		</main>
	);
}