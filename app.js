// 주요 DOM 요소
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const message = document.getElementById("message");
const filterButtons = document.querySelectorAll(".filter-button");
const previousDateButton = document.getElementById("previous-date-button");
const nextDateButton = document.getElementById("next-date-button");
const selectedDateText = document.getElementById("selected-date-text");

// 로컬스토리지에 사용할 Todo 저장 키
const TODO_STORAGE_KEY = "todoList";

// Todo 데이터를 저장할 배열
let todos = [];

// 현재 선택된 필터 상태
let currentFilter = "all";

// 현재 선택된 날짜
let selectedDate = new Date();

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 * @param {Date} date
 * @returns {string}
 */
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * 화면에 표시할 날짜 문구 생성
 * @param {Date} date
 * @returns {string}
 */
function formatDateLabel(date) {
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
    });
}

/**
 * 선택된 날짜 텍스트 갱신
 */
function renderSelectedDate() {
    selectedDateText.textContent = formatDateLabel(selectedDate);
}

/**
 * Todo 배열을 로컬스토리지에 저장
 */
function saveTodos() {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

/**
 * 로컬스토리지에서 Todo 데이터를 불러오기
 */
function loadTodos() {
    const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

/**
 * 안내 메시지 출력
 * @param {string} text
 */
function showMessage(text) {
    message.textContent = text;

    setTimeout(() => {
        message.textContent = "";
    }, 2000);
}

/**
 * 현재 필터에 맞는 Todo 반환
 */
function getFilteredTodos() {
    const selectedDateKey = formatDateKey(selectedDate);
    const todosByDate = todos.filter((todo) => todo.date === selectedDateKey);

    switch (currentFilter) {
        case "active":
            return todosByDate.filter((todo) => !todo.completed);

        case "completed":
            return todosByDate.filter((todo) => todo.completed);

        default:
            return todosByDate;
    }
}

/**
 * Todo 목록 렌더링
 */
function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = getFilteredTodos();

    // 미완료 → 완료 순서로 정렬
    const sortedTodos = [...filteredTodos].sort(
        (a, b) => Number(a.completed) - Number(b.completed)
    );

    sortedTodos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");

        if (todo.completed) {
            todoItem.classList.add("completed");
        }

        // 체크박스
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.classList.add("todo-checkbox");

        checkbox.addEventListener("change", () => {
            toggleTodo(todo.id);
        });

        // 텍스트
        const todoText = document.createElement("span");
        todoText.classList.add("todo-text");
        todoText.textContent = todo.text;

        // 수정 버튼
        const editButton = document.createElement("button");
        editButton.textContent = "✏";
        editButton.classList.add("edit-button");

        editButton.addEventListener("click", () => {
            editTodo(todo.id);
        });

        // 삭제 버튼
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✕";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", () => {
            deleteTodo(todo.id);
        });

        // 버튼 영역
        const actionContainer = document.createElement("div");
        actionContainer.classList.add("todo-actions");

        actionContainer.append(editButton);
        actionContainer.append(deleteButton);

        todoItem.append(checkbox);
        todoItem.append(todoText);
        todoItem.append(actionContainer);

        todoList.append(todoItem);
    });
}

/**
 * Todo 추가
 */
function addTodo() {
    const todoText = todoInput.value.trim();

    if (!todoText) {
        showMessage("할 일을 입력해주세요.");
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        date: formatDateKey(selectedDate),
        completed: false,
    };

    todos.push(newTodo);

    todoInput.value = "";

    saveTodos();
    renderTodos();
}

/**
 * Todo 완료 상태 변경
 * 완료된 Todo는 자동으로 아래로 이동
 */
function toggleTodo(todoId) {
    todos = todos.map((todo) => {
        if (todo.id === todoId) {
            return {
                ...todo,
                completed: !todo.completed,
            };
        }

        return todo;
    });

    saveTodos();
    renderTodos();
}

/**
 * Todo 수정
 */
function editTodo(todoId) {
    const targetTodo = todos.find((todo) => todo.id === todoId);

    const updatedText = prompt(
        "수정할 내용을 입력하세요.",
        targetTodo.text
    );

    if (updatedText === null) {
        return;
    }

    const trimmedText = updatedText.trim();

    if (!trimmedText) {
        showMessage("내용은 비워둘 수 없습니다.");
        return;
    }

    targetTodo.text = trimmedText;

    saveTodos();
    renderTodos();
}

/**
 * Todo 삭제
 */
function deleteTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);

    saveTodos();
    renderTodos();
}

/**
 * 필터 탭 활성화
 */
function changeFilter(filterType) {
    currentFilter = filterType;

    // active 클래스 갱신
    filterButtons.forEach((button) => {
        button.classList.remove("active");

        if (button.dataset.filter === filterType) {
            button.classList.add("active");
        }
    });

    renderTodos();
}

/**
 * 선택 날짜 이동
 * @param {number} dayAmount
 */
function moveSelectedDate(dayAmount) {
    selectedDate.setDate(selectedDate.getDate() + dayAmount);

    renderSelectedDate();
    renderTodos();
}

// Todo 생성 이벤트
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
});

// 이전 날짜 이동 이벤트
previousDateButton.addEventListener("click", () => {
    moveSelectedDate(-1);
});

// 다음 날짜 이동 이벤트
nextDateButton.addEventListener("click", () => {
    moveSelectedDate(1);
});

// 필터 버튼 이벤트
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        changeFilter(button.dataset.filter);
    });
});

// 초기 화면 날짜 표시
loadTodos();
renderSelectedDate();
renderTodos();
