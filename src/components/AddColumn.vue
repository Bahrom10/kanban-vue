<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-500/50 bg bg-opacity-50 flex items-center justify-center z-50">
        <div class="dialog w-1/4 bg-white rounded-2xl h-[200px]">
            <div class="header flex justify-between items-center p-4 border-b">
                <h2 class="text-lg font-semibold">Add Column</h2>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="content p-4">
                <form @submit.prevent="createColumn">
                    <div class="mb-4">
                        <input type="text" id="columnName" name="columnName" required class="border-1 mt-0.5 p-1 block w-full border-gray-300 outline-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Enter Column Name" v-model="columnName" maxlength="20">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Add Column</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "Modal",
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columnName: ''
        };
    },
    emits: ["close", "add-column"],
    methods: {
        closeModal() {
            this.$emit("close");
            setTimeout(location.reload, 300)
        },
        createColumn(){
            if (this.columnName.trim() === '') {
                alert("Column name cannot be empty.");
                return;
            }
            const newColumn: Column = {
                title: this.columnName,
                tasks: []
            };
            this.$emit("add-column", newColumn);
            this.columnName = '';
            this.closeModal();
        },
       handleKeyboardEvent(event: KeyboardEvent) {
            if (event.key === "Escape") {
                this.closeModal();
            }
        }
    },
    mounted() {
        document.addEventListener("keydown", this.handleKeyboardEvent);
    }       
}
</script>

<style lang="scss" scoped>

</style>