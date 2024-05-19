import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FilterType, TodoModel } from 'src/app/models/todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todolist = signal<TodoModel[]>([
    {
      id: 1,
      title: "Buy milk",
      completed: false,
      editing: false, 
    },
    {
      id: 1,
      title: "Buy bread",
      completed: false,
      editing: false, 
    },
    {
      id: 1,
      title: "Buy cheese",
      completed: false,
      editing: false, 
    },
    
  ]);
  
  filter = signal<FilterType>('all');
  
  newTodo = new FormControl ('asdsajdfjal',({
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  })) 

  changeFilter(filterString: FilterType){
    this.filter.set(filterString);
  }
  
  addTodo(){
    const newTodoTitle = this.newTodo.value.trim();
    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todolist.update((prev_todos) => {
        return [
          ...prev_todos,
          {id: Date.now(), title: newTodoTitle, completed: false, editing: false},
        ];
    
      });
    } else {
      
    }
  }
}
