const WEEK_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatMonthDay(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${month}/${day}`
}

function getWeekDates(selectedDate) {
  const weekStartDate = new Date(selectedDate)
  weekStartDate.setDate(selectedDate.getDate() - selectedDate.getDay())

  return Array.from({ length: 7 }, (_, dayIndex) => {
    const weekDate = new Date(weekStartDate)
    weekDate.setDate(weekStartDate.getDate() + dayIndex)

    return weekDate
  })
}

function TodoWeekNavigator({ todos, selectedDate, onMoveWeek, onSelectDate }) {
  const weekDates = getWeekDates(selectedDate)
  const weekStartDate = weekDates[0]
  const weekEndDate = weekDates[6]
  const weekRangeText = `${formatMonthDay(weekStartDate)} - ${formatMonthDay(weekEndDate)}`
  const selectedDateKey = formatDateKey(selectedDate)
  const todayDateKey = formatDateKey(new Date())

  return (
    <div className="week-view">
      <div className="week-navigation">
        <button
          type="button"
          className="week-navigation-button"
          onClick={() => onMoveWeek(-1)}
          aria-label="이전 주차로 이동"
        >
          {'\u25C0'}
        </button>
        <p className="week-range-text">{weekRangeText}</p>
        <button
          type="button"
          className="week-navigation-button"
          onClick={() => onMoveWeek(1)}
          aria-label="다음 주차로 이동"
        >
          {'\u25B6'}
        </button>
      </div>
      <div className="week-date-list">
        {weekDates.map((weekDate, dayIndex) => {
          const weekDateKey = formatDateKey(weekDate)
          const todosByDate = todos.filter((todo) => todo.date === weekDateKey)
          const completedTodoCount = todosByDate.filter((todo) => todo.isCompleted).length
          const totalTodoCount = todosByDate.length
          const isSelectedDate = weekDateKey === selectedDateKey
          const isToday = weekDateKey === todayDateKey
          const isAllCompleted = completedTodoCount === totalTodoCount

          return (
            <button
              key={weekDateKey}
              type="button"
              className={[
                'week-date-button',
                isSelectedDate ? 'selected' : '',
                isToday ? 'today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(weekDate)}
              aria-label={`${formatMonthDay(weekDate)} ${WEEK_DAY_LABELS[dayIndex]}요일 Todo 보기`}
            >
              <span className="week-day-label">{WEEK_DAY_LABELS[dayIndex]}</span>
              <span className="week-day-number">{weekDate.getDate()}</span>
              {totalTodoCount > 0 ? (
                <span className={isAllCompleted ? 'week-count complete' : 'week-count incomplete'}>
                  {completedTodoCount}/{totalTodoCount}
                </span>
              ) : (
                <span className="week-count placeholder" aria-hidden="true">
                  0/0
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TodoWeekNavigator
