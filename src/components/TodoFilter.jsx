const TODO_FILTER_TABS = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행 중' },
  { id: 'completed', label: '완료' },
]

function TodoFilter({ selectedFilter, onChangeFilter }) {
  return (
    <nav className="filter-navigation" aria-label="Todo 상태 필터">
      {TODO_FILTER_TABS.map((filterTab) => {
        const isSelectedFilter = selectedFilter === filterTab.id

        return (
          <button
            key={filterTab.id}
            type="button"
            className={
              isSelectedFilter ? 'filter-navigation-item selected' : 'filter-navigation-item'
            }
            onClick={() => onChangeFilter(filterTab.id)}
            aria-current={isSelectedFilter ? 'page' : undefined}
          >
            {filterTab.label}
          </button>
        )
      })}
    </nav>
  )
}

export default TodoFilter
