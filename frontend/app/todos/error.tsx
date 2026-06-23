"use client";

export default function Error({
	reset,
}: {
	reset: () => void;
}) {
	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
				<p className="text-sm font-semibold text-red-500">오류가 발생했어요</p>
				<h1 className="mt-3 text-2xl font-bold text-slate-900">잠시 후 다시 시도해 주세요.</h1>
				<button
					type="button"
					onClick={reset}
					className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
				>
					다시 시도
				</button>
			</section>
		</main>
	);
}