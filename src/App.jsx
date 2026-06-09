import { useEffect, useMemo, useState } from 'react'
import TodoFilter from './components/TodoFilter'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import TodoWeekNavigator from './components/TodoWeekNavigator'
import './App.css'

const TODO_STORAGE_KEY = 'todoList'

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getTodoTimeOrder(todoTime) {
  if (!todoTime) {
    return Number.MAX_SAFE_INTEGER
  }

  const [hour, minute] = todoTime.split(':').map(Number)

  return hour * 60 + minute
}

function compareTodos(firstTodo, secondTodo) {
  const completionOrder = Number(firstTodo.isCompleted) - Number(secondTodo.isCompleted)

  if (completionOrder !== 0) {
    return completionOrder
  }

  const timeOrder = getTodoTimeOrder(firstTodo.time) - getTodoTimeOrder(secondTodo.time)

  if (timeOrder !== 0) {
    return timeOrder
  }

  // 완료 상태와 시간이 같다면 먼저 생성된 Todo가 위에 남도록 정렬합니다.
  return firstTodo.id - secondTodo.id
}

function loadStoredTodos() {
  const storedTodos = localStorage.getItem(TODO_STORAGE_KEY)

  if (!storedTodos) {
    return []
  }

  // 로컬스토리지에 저장된 문자열을 다시 Todo 배열로 복원합니다.
  return JSON.parse(storedTodos)
}

function App() {
  const [todos, setTodos] = useState(loadStoredTodos)
  const [inputMessage, setInputMessage] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const selectedDateKey = formatDateKey(selectedDate)

  useEffect(() => {
    // todos가 추가, 수정, 삭제, 완료 처리될 때마다 최신 배열을 문자열로 저장합니다.
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const filteredAndSortedTodos = useMemo(() => {
    // 선택된 날짜와 상태 필터를 적용한 뒤, 미완료/완료와 시간 순서로 정렬합니다.
    const todosBySelectedDate = todos.filter((todo) => todo.date === selectedDateKey)

    const filteredTodos = todosBySelectedDate.filter((todo) => {
      if (selectedFilter === 'active') {
        return !todo.isCompleted
      }

      if (selectedFilter === 'completed') {
        return todo.isCompleted
      }

      return true
    })

    return filteredTodos.sort(compareTodos)
  }, [todos, selectedDateKey, selectedFilter])

  const addTodo = (todoText, todoTime) => {
    const trimmedTodoText = todoText.trim()

    if (!trimmedTodoText) {
      setInputMessage('할 일을 입력해 주세요.')
      return
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedTodoText,
      time: todoTime,
      date: selectedDateKey,
      isCompleted: false,
    }

    setTodos((previousTodos) => [...previousTodos, newTodo])
    setInputMessage('')
  }

  const toggleTodoCompletion = (todoId) => {
    setTodos((previousTodos) =>
      previousTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        }
      }),
    )
  }

  const editTodo = (todoId, updatedTodoText, updatedTodoTime) => {
    const trimmedTodoText = updatedTodoText.trim()

    if (!trimmedTodoText) {
      setInputMessage('수정할 내용은 비워둘 수 없어요.')
      return false
    }

    setTodos((previousTodos) =>
      previousTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          text: trimmedTodoText,
          time: updatedTodoTime,
        }
      }),
    )
    setInputMessage('')
    return true
  }

  const deleteTodo = (todoId) => {
    setTodos((previousTodos) => previousTodos.filter((todo) => todo.id !== todoId))
  }

  const changeTodoFilter = (filterId) => {
    setSelectedFilter(filterId)
  }

  const moveSelectedWeek = (weekAmount) => {
    setSelectedDate((currentDate) => {
      const nextDate = new Date(currentDate)
      nextDate.setDate(nextDate.getDate() + weekAmount * 7)

      return nextDate
    })
  }

  const selectTodoDate = (date) => {
    setSelectedDate(new Date(date))
  }

  return (
    <main className="todo-page">
      <section className="todo-container">
        <h1 className="app-title">Todo List</h1>
        <TodoWeekNavigator
          todos={todos}
          selectedDate={selectedDate}
          onMoveWeek={moveSelectedWeek}
          onSelectDate={selectTodoDate}
        />
        <TodoInput onAddTodo={addTodo} message={inputMessage} />
        <TodoFilter selectedFilter={selectedFilter} onChangeFilter={changeTodoFilter} />
        <div className="todo-list-scroll-area">
          <TodoList
            todos={filteredAndSortedTodos}
            onToggleTodo={toggleTodoCompletion}
            onEditTodo={editTodo}
            onDeleteTodo={deleteTodo}
          />
        </div>
      </section>
    </main>
  )
}

export default App
