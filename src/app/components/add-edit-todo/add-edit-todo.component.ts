import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TodoItem } from '../../models/todo-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-add-edit-todo',
  templateUrl: './add-edit-todo.component.html',
  styleUrls: ['./add-edit-todo.component.css']
})
export class AddEditTodoComponent implements OnInit {

  public headerTitle = '';
  private todo?: TodoItem;
  public form!: FormGroup;

  public constructor(
    private dialogRef: MatDialogRef<AddEditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: TodoItem,
    private appSvc: AppService,
    ) { }

  public ngOnInit(): void {
    this.setInitialData();
    this.setForm();
  }

  private setInitialData(): void {
    if (this.dialogData) {
      this.todo = this.dialogData;
      this.headerTitle = `Editor Mode - #${this.todo.id}`;
    } else {
      this.headerTitle = 'Create Mode';
    }
  }

  private setForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this.todo?.title, Validators.required),
      content: new FormControl(this.todo?.content),
    });
  }

  public save() {
    if (this.form.valid) {
      this.todo = {
        ...this.todo,
        title: this.form.get('title')?.value,
        content: this.form.get('content')?.value,
        done: this.todo?.done ? this.todo.done : false,
      };
      this.todo.id !== undefined ? this.appSvc.editTodo(this.todo) :this.appSvc.addTodo(this.todo);
    }
    this.close();

  }

  public close() {
    this.dialogRef.close();
  }
}
