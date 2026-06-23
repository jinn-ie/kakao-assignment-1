"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Todo } from "@/lib/todos";

export default function TodoItem({ todo }: { todo: Todo }) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isCompleted, setIsCompleted] = useState(todo.completed);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleCompletedChange = async (nextCompleted: boolean) => {
		const previousCompleted = isCompleted;

		setIsCompleted(nextCompleted);
		setIsUpdating(true);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/todos", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: todo.id,
					contents: todo.contents,
					completed: nextCompleted,
				}),
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { message?: string } | null;
				throw new Error(payload?.message ?? "Failed to update todo status.");
			}

			router.refresh();
		} catch (error) {
			setIsCompleted(previousCompleted);
			setErrorMessage(error instanceof Error ? error.message : "Failed to update todo status.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		const confirmed = window.confirm(`Delete "${todo.contents}"?`);

		if (!confirmed) {
			return;
		}

		setIsDeleting(true);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/todos", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: todo.id }),
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { message?: string } | null;
				throw new Error(payload?.message ?? "Failed to delete todo.");
			}

			router.refresh();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Failed to delete todo.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<li className="rounded-3xl border border-violet-100 bg-white px-5 py-4 shadow-sm shadow-violet-100/40">
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					checked={isCompleted}
					onChange={(event) => handleCompletedChange(event.target.checked)}
					disabled={isUpdating || isDeleting}
					className="h-5 w-5 rounded border-violet-300 text-violet-600 accent-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
					aria-label={`Todo ${todo.id} completed`}
				/>

				<div className="min-w-0 flex-1">
					<p
						className={`truncate text-base font-medium ${
							isCompleted ? "text-slate-400 line-through" : "text-slate-900"
						}`}
					>
						{todo.contents}
					</p>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<Link
						href={`/todos/${todo.id}`}
						className="inline-flex h-9 min-w-14 items-center justify-center rounded-full bg-violet-100 px-3 text-sm font-medium text-violet-700 transition hover:bg-violet-200"
						aria-label={`Edit todo ${todo.id}`}
					>
						Edit
					</Link>
					<button
						type="button"
						onClick={handleDelete}
						disabled={isDeleting}
						className="inline-flex h-9 min-w-14 items-center justify-center rounded-full bg-rose-100 px-3 text-sm font-medium text-rose-600 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
						aria-label={`Delete todo ${todo.id}`}
					>
						{isDeleting ? "..." : "Delete"}
					</button>
				</div>
			</div>
			{errorMessage && <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>}
		</li>
	);
}
