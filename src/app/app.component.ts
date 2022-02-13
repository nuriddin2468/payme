import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditTodoComponent } from './components/add-edit-todo/add-edit-todo.component';
import { Subscription } from 'rxjs';
import { TodoItem } from './models/todo-item';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public todos: TodoItem[] = [];
  private todos$?: Subscription;
  searchValue = '';


  public constructor(
    private dialog: MatDialog,
    private appSvc: AppService
  ) {
  }

  public ngOnInit(): void {
    this.todos$ = this.appSvc.todos.subscribe(data => this.todos = data);
    this.appSvc.getAllTodos();
  }

  public createTodo(): void {
    this.dialog.open(AddEditTodoComponent, {});
  }

  public editTodo(item: TodoItem): void {
    this.dialog.open(AddEditTodoComponent, {
      data: item,
    });
  }

  public toggleStatusTodo(item: TodoItem): void {
    this.appSvc.toggleStatusTodo(item);
  }

  public deleteTodo(item: TodoItem): void {
    this.appSvc.deleteTodo(item);
  }

  public searchTodo(): void {
    this.appSvc.searchTodos(this.searchValue);
  }

  public getAllTodos() {
    this.searchValue = '';
    this.appSvc.getAllTodos();
  }

  public ngOnDestroy(): void {
    this.todos$?.unsubscribe();
  }
}
