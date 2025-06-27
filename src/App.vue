<template>
  <Navbar @open-modal="modalColumnOpen = true" />
  <Transition name="slide-down" mode="out-in">
    <AddColumn :isOpen="modalColumnOpen" @close="modalColumnOpen = false" @add-column="handleAddColumn" v-if="modalColumnOpen" />
  </Transition>
  <Transition name="slide-down" mode="out-in">
        <AddCard :isOpen="modalCardOpen" v-if="modalCardOpen"  :column-name="columnTitle" @close="modalCardOpen = false" @add-card="addTask"/>
  </Transition>
  <draggable
    v-model="columns"
    group="columns"
    item-key="title"
    class="flex h-full"
    :animation="200"
    @update:list="saveColumnsToStorage"
  >
    <template #item="{ element, index }">
      <Column
        :index="index"
        :title="element.title"
        :tasks="element.tasks"
        @remove-column="id => columns.splice(id, 1) && saveColumnsToStorage()"
        @update:tasks="tasks => { console.log(tasks);columns[index].tasks = tasks; saveColumnsToStorage(); }"
        @open-task-modal="openTaskModal" 
        @remove-task="removeTask" 
        @card-moved="handleCardMoved"
        @dragstart="removeDragImage"
      />
    </template>
  </draggable>
</template>

<script lang="ts">
import AddCard from './components/AddCard.vue';
import Column from './components/Column.vue';
import AddColumn from './components/AddColumn.vue';
import Navbar from './components/Navbar.vue';
import draggable from 'vuedraggable';
export default {
  data(): {
    search: string,
    modalColumnOpen: boolean,
    columns: Array<Column>,
    modalCardOpen: boolean,
    columnTitle: string,
  } {
    return {
      search: '',
      modalColumnOpen: false,
      columns: [],
      modalCardOpen: false,
      columnTitle: ''
    };
  },
  name: "app",
  components: {
    Navbar,
    AddColumn,
    Column,
    AddCard,
    draggable
  },
  created() {
    this.loadColumnsFromStorage();
    const userPref = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userPref === 'true' || (!userPref && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

  },
  mounted() {
    window.addEventListener('beforeunload', this.saveColumnsToStorage);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.saveColumnsToStorage);
  },
  methods: {
    loadColumnsFromStorage() {
      const data = localStorage.getItem('columns');
      if (data) {
        try {
          this.columns = JSON.parse(data);
        } catch (error) {
          console.error("Error parsing columns from localStorage:", error);
          this.columns = [];
        }
      } else {
        this.columns = [];
      }
    },
    saveColumnsToStorage() {
      localStorage.setItem('columns', JSON.stringify(this.columns));
    },
    handleAddColumn(newColumn: Column) {
      console.log("handleAddColumn called with:", newColumn);
      if (!newColumn || !newColumn.title || newColumn.title.trim() === '') {
        alert("Column name cannot be empty.");
        return;
      }
      if (this.columns.some(column => column.title === newColumn.title)) {
        alert("Column with this name already exists.");
        return;
      }
      console.log("Adding new column:", newColumn);

      this.columns.push(newColumn);
      this.$nextTick(() => {
        this.saveColumnsToStorage();
        console.log(this.columns);
      });
    },
    handleColumnChange(){

    },
    openTaskModal(title: string){
      console.log("addTask called with:", title);
      this.modalCardOpen = true;
      this.columnTitle = title
    },
    addTask(task: Task){
      this.columns.find(el => el.title === this.columnTitle)?.tasks.push(task)
      this.saveColumnsToStorage()
    },
    removeTask({ columnIndex, taskIndex }: { columnIndex: number, taskIndex: number }) {
      const column = this.columns[columnIndex];
      if (column && column.tasks) {
        column.tasks.splice(taskIndex, 1);
        this.saveColumnsToStorage();
      }
    },
    handleCardMoved() {
      this.saveColumnsToStorage();
    },
    removeDragImage(event: DragEvent) {
            const img = new Image();
            img.src = '';
            img.style.display = 'none';
            document.body.appendChild(img);
            if(event.dataTransfer) event.dataTransfer.setDragImage(img, 0, 0);
            setTimeout(() => document.body.removeChild(img), 0);
        }
  }

}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}

.slide-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
</style>
