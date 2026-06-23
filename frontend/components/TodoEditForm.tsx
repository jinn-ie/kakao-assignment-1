"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import type { Todo } from "@/lib/todos";

export default function TodoEditForm({ todo }: { todo: Todo }) {
	const router = useRouter();
	const [contents, setContents] = useState(todo.contents);
	const [completed, setCompleted] = useState(todo.completed);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trimmedContents = contents.trim();

		if (!trimmedContents) {
			setErrorMessage("Please enter todo contents.");
			return;
		}

		setIsSubmitting(true);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/todos", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: todo.id,
					contents: trimmedContents,
					completed,
				}),
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { message?: string } | null;
				throw new Error(payload?.message ?? "Failed to update todo.");
			}

			router.push("/todos");
			router.refresh();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Failed to update todo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<li className="rounded-3xl border border-violet-200 bg-violet-50/70 px-5 py-4 shadow-sm shadow-violet-100/50">
			<form className="flex items-center gap-3" onSubmit={handleSubmit}>
				<input
					type="checkbox"
					checked={completed}
					onChange={(event) => setCompleted(event.target.checked)}
					disabled={isSubmitting}
					className="h-5 w-5 rounded border-violet-300 text-violet-600 accent-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
					aria-label={`Todo ${todo.id} completed`}
				/>

				<div className="min-w-0 flex-1">
					<input
						type="text"
						value={contents}
						onChange={(event) => setContents(event.target.value)}
						className="h-10 w-full rounded-2xl border border-violet-200 bg-white px-4 text-base font-medium text-slate-900 outline-none focus:border-violet-400"
					/>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<button
						type="submit"
						disabled={isSubmitting}
						className="inline-flex h-9 min-w-14 items-center justify-center rounded-full bg-violet-600 px-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "..." : "Save"}
					</button>
					<Link
						href="/todos"
						className="inline-flex h-9 min-w-14 items-center justify-center rounded-full bg-rose-100 px-3 text-sm font-medium text-rose-600 transition hover:bg-rose-200"
						aria-label={`Cancel editing todo ${todo.id}`}
					>
						Cancel
					</Link>
				</div>
			</form>
			{errorMessage && <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>}
		</li>
	);
}
