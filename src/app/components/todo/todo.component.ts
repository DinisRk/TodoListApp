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
      id: 2,
      title: "Buy bread",
      completed: false,
      editing: false, 
    },
    {
      id: 3,
      title: "Buy cheese",
      completed: false,
      editing: false, 
    },
    
  ]);
  
  filter = signal<FilterType>('all');
  
  newTodo = new FormControl ('',({
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
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
      
    }
    
  }
  
  toggleTodo(todoId: number){
     return this.todolist.update((prev_todos)=> prev_todos.map((todo) => {
      if (todo.id === todoId) {
        return{
          ...todo,
          completed: !todo.completed,
        };
      }
      return {...todo, editing: false}
    })
   );
  }
}
