import { useState } from 'react'

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  return String(hour).padStart(2, '0')
})

const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, minuteIndex) => {
  return String(minuteIndex * 5).padStart(2, '0')
})

function getTimeParts(todoTime) {
  if (!todoTime) {
    return {
      hour: '',
      minute: '',
    }
  }

  const [hour, minute] = todoTime.split(':')

  return {
    hour,
    minute,
  }
}

function TodoItem({ todo, onToggleTodo, onEditTodo, onDeleteTodo }) {
  const initialTimeParts = getTimeParts(todo.time)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTodoText, setEditingTodoText] = useState(todo.text)
  const [editingHour, setEditingHour] = useState(initialTimeParts.hour)
  const [editingMinute, setEditingMinute] = useState(initialTimeParts.minute)
  const todoItemClassName = [
    'todo-item',
    todo.isCompleted ? 'completed' : '',
    todo.time ? 'has-time' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const startEditingTodo = () => {
    const currentTimeParts = getTimeParts(todo.time)

    setEditingTodoText(todo.text)
    setEditingHour(currentTimeParts.hour)
    setEditingMinute(currentTimeParts.minute)
    setIsEditing(true)
  }

  const cancelEditingTodo = () => {
    const currentTimeParts = getTimeParts(todo.time)

    setEditingTodoText(todo.text)
    setEditingHour(currentTimeParts.hour)
    setEditingMinute(currentTimeParts.minute)
    setIsEditing(false)
  }

  const saveEditingTodo = () => {
    // 시와 분이 모두 선택됐을 때만 HH:MM 형태로 저장하고, 아니면 시간 없이 저장합니다.
    const editingTodoTime = editingHour && editingMinute ? `${editingHour}:${editingMinute}` : ''
    const isSaved = onEditTodo(todo.id, editingTodoText, editingTodoTime)

    if (isSaved) {
      setIsEditing(false)
    }
  }

  const handleEditingTodoTextChange = (event) => {
    setEditingTodoText(event.target.value)
  }

  const handleEditingHourChange = (event) => {
    setEditingHour(event.target.value)
  }

  const handleEditingMinuteChange = (event) => {
    setEditingMinute(event.target.value)
  }

  const handleEditingTodoKeyDown = (event) => {
    if (event.key === 'Enter') {
      saveEditingTodo()
    }

    if (event.key === 'Escape') {
      cancelEditingTodo()
    }
  }

  const handleEditControlsBlur = (event) => { // 수정모드 영역에서 벗어났을 때 자동 저장
    if (!event.currentTarget.contains(event.relatedTarget)) {
      saveEditingTodo()
    }
  }

  return (
    <li className={todoItemClassName}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.isCompleted}
        onChange={() => onToggleTodo(todo.id)}
        aria-label={`${todo.text} 완료 상태 변경`}
      />
      {isEditing ? (
        <div className="todo-edit-controls" onBlur={handleEditControlsBlur}>
          <div className="todo-edit-time-group" aria-label="Todo 수정 시간 선택">
            <select
              className="todo-edit-time-select"
              value={editingHour}
              onChange={handleEditingHourChange}
              aria-label="수정할 시 선택"
            >
              <option value="">--</option>
              {HOUR_OPTIONS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <span className="time-separator">:</span>
            <select
              className="todo-edit-time-select"
              value={editingMinute}
              onChange={handleEditingMinuteChange}
              aria-label="수정할 분 선택"
            >
              <option value="">--</option>
              {MINUTE_OPTIONS.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="todo-edit-input"
            value={editingTodoText}
            onChange={handleEditingTodoTextChange}
            onKeyDown={handleEditingTodoKeyDown}
            autoFocus
          />
        </div>
      ) : (
        <>
          {todo.time && <span className="todo-time">{todo.time}</span>}
          <span className="todo-text">{todo.text}</span>
        </>
      )}
      <div className="todo-actions">
        <button
          type="button"
          className="edit-button"
          onClick={startEditingTodo}
          aria-label={`${todo.text} 수정`}
        >
          {'\u270E'}
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDeleteTodo(todo.id)}
          aria-label={`${todo.text} 삭제`}
        >
          X
        </button>
      </div>
    </li>
  )
}

export default TodoItem
