import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

function getBackendUrl() {
	if (!BACKEND_URL) {
		throw new Error("BACKEND_URL 환경변수가 필요합니다.");
	}

	return BACKEND_URL;
}

async function readErrorMessage(response: Response) {
	try {
		const payload = (await response.json()) as { detail?: string; message?: string };
		return payload.detail ?? payload.message ?? "요청에 실패했습니다.";
	} catch {
		return "요청에 실패했습니다.";
	}
}

export async function POST(request: Request) {
	const body = (await request.json().catch(() => ({}))) as { contents?: string };
	const contents = body.contents?.trim();

	if (!contents) {
		return NextResponse.json({ message: "할 일을 입력해 주세요." }, { status: 400 });
	}

	const response = await fetch(`${getBackendUrl()}/todos`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contents }),
	});

	if (!response.ok) {
		return NextResponse.json(
			{ message: await readErrorMessage(response) },
			{ status: response.status },
		);
	}

	return NextResponse.json(await response.json(), { status: response.status });
}

export async function PUT(request: Request) {
	const body = (await request.json().catch(() => ({}))) as {
		id?: number;
		contents?: string;
		completed?: boolean;
	};
	const todoId = Number(body.id);

	if (!Number.isInteger(todoId)) {
		return NextResponse.json({ message: "유효한 Todo ID가 필요합니다." }, { status: 400 });
	}

	const nextContents = body.contents !== undefined ? body.contents.trim() : "";
	const nextCompleted = typeof body.completed === "boolean" ? body.completed : undefined;

	if (!nextContents) {
		return NextResponse.json({ message: "할 일을 입력해 주세요." }, { status: 400 });
	}

	const response = await fetch(`${getBackendUrl()}/todos/${todoId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contents: nextContents, completed: nextCompleted }),
	});

	if (!response.ok) {
		return NextResponse.json(
			{ message: await readErrorMessage(response) },
			{ status: response.status },
		);
	}

	return NextResponse.json(await response.json(), { status: response.status });
}

export async function DELETE(request: Request) {
	const body = (await request.json().catch(() => ({}))) as { id?: number };
	const todoId = Number(body.id);

	if (!Number.isInteger(todoId)) {
		return NextResponse.json({ message: "유효한 Todo ID가 필요합니다." }, { status: 400 });
	}

	const response = await fetch(`${getBackendUrl()}/todos/${todoId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		return NextResponse.json(
			{ message: await readErrorMessage(response) },
			{ status: response.status },
		);
	}

	return NextResponse.json({ ok: true });
}
