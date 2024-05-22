import { CommonModule, JsonPipe } from '@angular/common';
import { Component, signal, computed, OnInit, effect } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FilterType, TodoModel } from 'src/app/models/todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todolist = signal<TodoModel[]>([]);
  
  filter = signal<FilterType>('all');
  
  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todolist();
    
    switch(filter){
      case 'active': 
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  });
  
  newTodo = new FormControl ('',({
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  }));
  
  constructor(){
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    });
  }
  
  ngOnInit(): void{
    const storage = localStorage.getItem('todos');
    if (storage){
      this.todolist.set(JSON.parse(storage)); 
    }
  }

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
     return this.todolist.update((prev_todos) => 
     prev_todos.map((todo) => {
      return todo.id === todoId ? 
        {...todo, completed: !todo.completed} :
        todo;
      
      /* if (todo.id === todoId) {
        return{
          ...todo,
          completed: !todo.completed,
        };
      }
      return {...todo, editing: false} */
    })
   );
  }
  
  removeTodo(todoId: number){
    this.todolist.update((prev_todos) => 
    prev_todos.filter((todo) => todo.id !== todoId) 
    );
  }
  
  updateTodo(todoId: number){
    return this.todolist.update((prev_todos) =>
    prev_todos.map((todo) => {
      return todo.id === todoId ?
      {...todo, editing: true} : 
      {...todo, editing: false};
    })
    );
  }
  
  saveTitleTodo(todoId: number, event: Event){
    const title = (event.target as HTMLInputElement).value;
    this.todolist.update((prev_todos) => 
    prev_todos.map((todo) => {
      return todo.id === todoId ?
      {...todo, title: title, editing: false} :
      todo;
    })
    );
  }
  
}
