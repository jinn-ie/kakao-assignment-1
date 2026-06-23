from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
from pathlib import Path
from sqlalchemy import create_engine, Column, DateTime, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel


def load_env_file(path: Path):
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


load_env_file(Path(__file__).with_name(".env.local"))

# DB ?ㅼ젙
DATABASE_URL = os.environ["DATABASE_URL"]
FRONTEND_ORIGIN = os.environ["FRONTEND_ORIGIN"]
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 紐⑤뜽 (?뚯씠釉?援ъ“ ?뺤쓽)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    # ?섎㉧吏 ?꾨뱶瑜?吏곸젒 異붽??대낫?몄슂
    contents = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    created_time = Column(DateTime, default=datetime.utcnow)

# Pydantic ?ㅽ궎留?(?붿껌/?묐떟 ?곗씠??援ъ“ ?뺤쓽)
class TodoCreate(BaseModel):
    # ?앹꽦 ???꾩슂???꾨뱶瑜?吏곸젒 異붽??대낫?몄슂
    contents: str

class TodoUpdate(BaseModel):
    contents: str
    completed: bool | None = None

# ?뚯씠釉??앹꽦
Base.metadata.create_all(bind=engine)

# FastAPI ???앹꽦
app = FastAPI(title="Todo API")

# FastAPI ??誘몃뱾?⑥뼱 諛?CORS ?ㅼ젙 -- FE-BE ?듭떊 媛꾩뿉 嫄곗튂??怨듯넻 泥섎━湲?
app.add_middleware(
    # ?꾩슂??遺遺꾩쓣 吏곸젒 ?묒꽦?대낫?몄슂.
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB ?몄뀡 ?섏〈??-- DB ?몄뀡??愿由ы븯??怨듯넻 ?섏〈??
def get_db():
    # ?꾩슂??遺遺꾩쓣 吏곸젒 ?묒꽦?대낫?몄슂.
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()  # ?몄뀡??諛섎뱶???リ린 ?꾪븿

# ?붾뱶?ъ씤??援ы쁽
# API 紐⑸줉???대떦?섎뒗 遺遺꾩쓣 吏곸젒 援ы쁽?대낫?몄슂
@app.get("/todos")
def read_todos(db=Depends(get_db)):
    # DB?먯꽌 紐⑤뱺 ??????ぉ??媛?몄삤??濡쒖쭅??吏곸젒 ?묒꽦?대낫?몄슂.
    return db.query(Todo).all()

@app.post("/todos")
def create_todo(todo: TodoCreate, db=Depends(get_db)):
    # DB???덈줈????????ぉ??異붽??섎뒗 濡쒖쭅??吏곸젒 ?묒꽦?대낫?몄슂.
    db_todo = Todo(contents=todo.contents)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.put("/todos/{id}")
def update_todo(id: int, todo: TodoUpdate, db=Depends(get_db)):
    # DB?먯꽌 ?뱀젙 ID????????ぉ???낅뜲?댄듃?섎뒗 濡쒖쭅??吏곸젒 ?묒꽦?대낫?몄슂.
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.contents = todo.contents
    if todo.completed is not None:
        db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{id}")
def delete_todo(id: int, db=Depends(get_db)):
    # DB?먯꽌 ?뱀젙 ID????????ぉ????젣?섎뒗 濡쒖쭅??吏곸젒 ?묒꽦?대낫?몄슂.
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return
