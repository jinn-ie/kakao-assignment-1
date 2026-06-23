"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function TodoForm() {
	const router = useRouter();
	const [contents, setContents] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trimmedContents = contents.trim();

		if (!trimmedContents) {
			setErrorMessage("할 일을 입력해 주세요.");
			return;
		}

		setIsSubmitting(true);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contents: trimmedContents }),
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { message?: string } | null;
				throw new Error(payload?.message ?? "Todo 생성에 실패했습니다.");
			}

			setContents("");
			router.refresh();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Todo 생성에 실패했습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			className="mt-6 rounded-3xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm shadow-violet-100/50"
			onSubmit={handleSubmit}
		>
			<div className="flex gap-3">
				<input
					id="todo-input"
					type="text"
					value={contents}
					onChange={(event) => setContents(event.target.value)}
					placeholder="할 일을 입력해 주세요"
					className="h-12 flex-1 rounded-2xl border border-violet-200 bg-white px-4 text-sm outline-none placeholder:text-violet-300 focus:border-violet-400"
				/>
				<button
					type="submit"
					disabled={isSubmitting}
					className="h-12 rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSubmitting ? "추가 중..." : "추가"}
				</button>
			</div>
			{errorMessage && <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>}
		</form>
	);
}