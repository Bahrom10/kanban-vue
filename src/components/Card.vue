<template>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-3 flex flex-col gap-1 relative" draggable="true"
        @dragstart="removeDragImage" @dragend="$emit('drag-end', index)">
        <button @click="$emit('remove-task')" class="self-end text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <p class="font-semibold flex justify-between items-center text-gray-800 dark:text-gray-100">{{ task.title }}
            <span class="font-normal text-xs">{{ task.date.split("-").reverse().join(".") }}</span></p>
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ task.description }}</p>
    </div>
</template>

<script lang="ts">
export default {
    name: "Card",
    props: {
        task: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    emits: ["remove-task", "drag-start", "drag-end"],
    methods: {
        removeDragImage(event: DragEvent) {
            const img = new Image();
            img.src = '';
            img.style.display = 'none';
            document.body.appendChild(img);
            if(event.dataTransfer) event.dataTransfer.setDragImage(img, 0, 0);
            setTimeout(() => document.body.removeChild(img), 0);
            this.$emit('drag-start', this.index)
        }
    }
}
</script>