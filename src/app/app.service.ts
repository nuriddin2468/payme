import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TodoItem } from './models/todo-item';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public todos: BehaviorSubject<TodoItem[]> = new BehaviorSubject<TodoItem[]>([]);

  public constructor() {
  }

  private static getFromStorage(): TodoItem[] {
    const data = localStorage.getItem('todos');
    if (data) {
      return JSON.parse(data) as TodoItem[];
    } else {
      return [];
    }
  }

  private updateStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos.getValue()));
  }

  public getAllTodos(): void {
    const storageData = AppService.getFromStorage();
    this.todos.next(storageData);
  }

  public addTodo(item: TodoItem): void {
    const todos = this.todos.getValue();
    if (todos.length > 0) {
      const lastItemId = todos[todos.length - 1].id;
      if (lastItemId !== undefined) {
        item.id = lastItemId + 1;
      }
    } else {
      item.id = 0;
    }
    this.todos.next([...this.todos.getValue(), item]);
    this.updateStorage();
  }

  public editTodo(item: TodoItem): void {
    const todos = this.todos.getValue();
    const index = todos.findIndex(data => data.id === item.id);
    todos[index] = item;
    this.todos.next(todos);
    this.updateStorage();
  }

  public deleteTodo(item: TodoItem): void {
    const todos = this.todos.getValue();
    this.todos.next(todos.filter(data => data.id !== item.id));
    this.updateStorage();
  }

  public toggleStatusTodo(item: TodoItem): void {
    item.done = !item.done;
    const todos = this.todos.getValue();
    const index = todos.findIndex(data => data.id === item.id);
    todos[index] = item;
    this.updateStorage();
  }

  public searchTodos(value: string): void {
    value = value.trim();
    if (value === '') {
      this.getAllTodos();
      return;
    }
    const todos = this.todos.getValue();
    const searchedTodos: TodoItem[] = [];
    for (const item of todos) {
      const searchedTitle = item.title.search(value);
      const searchedContent = item.content.search(value);
      if (searchedContent !== -1 || searchedTitle !== -1) {
        searchedTodos.push(item);
      }
    }
    this.todos.next(searchedTodos);
  }

}
