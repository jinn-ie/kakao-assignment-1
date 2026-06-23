import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import { getTodos } from "@/app/actions";

export default async function NewTodoPage() {
	const todos = await getTodos();

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-sky-50 to-amber-50 px-4 py-10">
			<section className="flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.14)] backdrop-blur sm:p-8">
				<h1 className="text-center text-3xl font-black tracking-tight text-violet-950 sm:text-4xl">
					Todo List
				</h1>
				<TodoForm />

				<div className="mt-6 flex-1">
					<TodoList todos={todos} />
				</div>
			</section>
		</main>
	);
}