import type { Todo } from "@/lib/todos";
import TodoItem from "@/components/TodoItem";
import TodoEditForm from "@/components/TodoEditForm";

export default function TodoList({
	todos,
	editingTodoId,
}: {
	todos: Todo[];
	editingTodoId?: number;
}) {
	return (
		<ul className="space-y-3">
			{todos.map((todo) => (
				editingTodoId === todo.id ? (
					<TodoEditForm key={todo.id} todo={todo} />
				) : (
					<TodoItem key={todo.id} todo={todo} />
				)
			))}
		</ul>
	);
}