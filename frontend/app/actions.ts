import { unstable_noStore as noStore } from "next/cache";

import type { Todo } from "@/lib/todos";

const BACKEND_URL = process.env.BACKEND_URL;

function getBackendUrl() {
	if (!BACKEND_URL) {
		throw new Error("BACKEND_URL 환경변수가 필요합니다.");
	}

	return BACKEND_URL;
}

export async function getTodos(): Promise<Todo[]> {
	noStore();

	const response = await fetch(`${getBackendUrl()}/todos`, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Todo 목록을 불러오지 못했습니다.");
	}

	return (await response.json()) as Todo[];
}

export async function getTodoById(todoId: number): Promise<Todo | null> {
	noStore();

	const todos = await getTodos();
	const todo = todos.find((item) => item.id === todoId);

	return todo ?? null;
}
