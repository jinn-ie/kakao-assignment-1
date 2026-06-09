import TodoItem from './TodoItem'

function TodoList({ todos, onToggleTodo, onEditTodo, onDeleteTodo }) {
  if (todos.length === 0) {
    return <p className="empty-message">아직 등록된 할 일이 없어요.</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onEditTodo={onEditTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  )
}

export default TodoList
