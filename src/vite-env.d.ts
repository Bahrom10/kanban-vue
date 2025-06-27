/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

type Task = {
  id: string,
  title: string,
  description: string,
  date: string,
  columnName: string
}

type Column = {
  title: string,
  tasks: Task[]
}