<template>
    <div class="bg-gray-600 dark:bg-gray-800 rounded-xl shadow-md p-4 m-4 w-72 flex flex-col">
        <div class="flex items-center justify-between  mb-4">
            <h2 class="text-lg font-bold text-gray-100 dark:text-gray-100 text-center">{{ title }}</h2>
            <button @click="$emit('remove-column', index)">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 text-gray-100 dark:text-gray-100 hover:text-red-500 cursor-pointer"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <draggable
            :list="tasks"
            group="tasks"
            item-key="id"
            class="flex-1 space-y-3 mb-4"
            :animation="200"
            @update:list="val => $emit('update:tasks', val)"
            @start="removeDragImage"
        >
            <template #item="{ element, index: taskIndex }">
                <Card
                    :index="taskIndex"
                    :task="element"
                    @remove-task="$emit('remove-task', { columnIndex: index, taskIndex })"
                />
            </template>
        </draggable>
        <!-- Hidden transparent image for drag -->
        <div ref="emptyDragImage" style="width:0;height:0;opacity:0;position:absolute;pointer-events:none;"></div>
        <button @click="$emit('open-task-modal', title)" class="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors cursor-pointer">
            Add Task
        </button>

    </div>
</template>

<script lang="ts">
import Card from './Card.vue';
import draggable from 'vuedraggable';
export default {
    name: "Column",
    components: { Card, draggable },
    props: {
        title: {
            type: String,
            required: true,
        },
        tasks: {
            type: Array,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    emits: ["remove-column", "open-task-modal", "remove-task", "update:tasks"],
    methods: {
        removeDragImage(event: any) {
            if (event && event.originalEvent && event.originalEvent?.dataTransfer) {
                const img = this.$refs.emptyDragImage as HTMLElement;
                event.originalEvent.dataTransfer.setDragImage(img, 0, 0);
            }
        }
    }
}
</script>

<style scoped>
.group-enter-active, .group-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.group-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.98);
}
.group-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.group-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.group-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>