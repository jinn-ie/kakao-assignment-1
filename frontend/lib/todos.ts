export type Todo = {
  id: number;
  contents: string;
  completed: boolean;
  created_time: string;
};

export const sampleTodos: Todo[] = [
  {
    id: 1,
    contents: "Next.js 투두 앱 화면 만들기",
    completed: false,
    created_time: "2026-06-24T09:00:00.000Z",
  },
  {
    id: 2,
    contents: "Todo 목록 페이지 구성하기",
    completed: true,
    created_time: "2026-06-24T09:20:00.000Z",
  },
  {
    id: 3,
    contents: "수정 페이지 연결 준비하기",
    completed: false,
    created_time: "2026-06-24T09:45:00.000Z",
  },
];

export function formatCreatedTime(createdTime: string) {
  return new Date(createdTime).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}