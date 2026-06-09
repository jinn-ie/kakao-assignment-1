import { useState } from 'react'

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  return String(hour).padStart(2, '0')
})

const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, minuteIndex) => {
  return String(minuteIndex * 5).padStart(2, '0')
})

function TodoInput({ onAddTodo, message }) {
  const [todoText, setTodoText] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // 시간은 선택 사항이므로 시와 분이 모두 선택됐을 때만 HH:MM 형태로 전달합니다.
    const todoTime = selectedHour && selectedMinute ? `${selectedHour}:${selectedMinute}` : ''
    onAddTodo(todoText, todoTime)

    if (todoText.trim()) {
      setTodoText('')
      setSelectedHour('')
      setSelectedMinute('')
    }
  }

  const handleTodoTextChange = (event) => {
    setTodoText(event.target.value)
  }

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value)
  }

  const handleMinuteChange = (event) => {
    setSelectedMinute(event.target.value)
  }

  return (
    <>
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="time-select-group" aria-label="Todo 시간 선택">
          <select
            className="time-select"
            value={selectedHour}
            onChange={handleHourChange}
            aria-label="시 선택"
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
            className="time-select"
            value={selectedMinute}
            onChange={handleMinuteChange}
            aria-label="분 선택"
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
          className="todo-input"
          value={todoText}
          onChange={handleTodoTextChange}
          placeholder="할 일을 입력해 주세요"
          autoComplete="off"
        />
        <button type="submit" className="add-button" aria-label="Todo 추가">
          +
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </>
  )
}

export default TodoInput
