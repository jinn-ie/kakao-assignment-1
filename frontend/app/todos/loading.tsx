export default function Loading() {
	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
				<div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
				<p className="mt-4 text-base font-medium text-slate-700">불러오는 중...</p>
			</section>
		</main>
	);
}