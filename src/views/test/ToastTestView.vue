<script setup lang="ts">
import { useToast } from "@/composables/useToast"
import BracketButton from "@/components/common/BracketButton.vue"

const toast = useToast()

const allPositions = () => {
  toast.success("All at once", { position: "top-left" })
  toast.success("All at once", { position: "top-center" })
  toast.success("All at once", { position: "top-right" })
  toast.success("All at once", { position: "bottom-left" })
  toast.success("All at once", { position: "bottom-center" })
  toast.success("All at once", { position: "bottom-right" })
}
</script>

<template>
  <div class="w-full text-center text-7xl pb-4">Test Toast</div>
  <div class="flex flex-wrap *:flex *:w-1/2 *:items-center *:p-4 *:flex-col">
    <div class="*:pb-2">
      <span class="text-2xl">Default</span>
      <div>
        <BracketButton
          class="mr-2 bg-emerald-950/60"
          color="emerald-400"
          border-radius="rounded-lg"
          @click="toast.success('Success')"
        >
          Success
        </BracketButton>
        <BracketButton
          class="mr-2 bg-blue-950/60"
          color="blue-400"
          @click="toast.info('Info')"
        >
          Info
        </BracketButton>
        <BracketButton
          class="mr-2 bg-amber-950/60 border-radius-0"
          color="amber-400"
          @click="toast.warning('Warning')"
        >
          Warning
        </BracketButton>
        <BracketButton
          class="mr-2
          bg-red-950/60"
          color="red-400"
          @click="toast.error('Error')"
        >
          Error
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">Hide timer</span>
      <div>
        <BracketButton
          class="mr-2 bg-emerald-950/60"
          color="emerald-400"
          @click="toast.success('Success', { showProgress: false })"
        >
          Success
        </BracketButton>
        <BracketButton
          class="mr-2 bg-blue-950/60"
          color="blue-400"
          @click="toast.info('Info', { showProgress: false })"
        >
          Info
        </BracketButton>
        <BracketButton
          class="mr-2 bg-amber-950/60"
          color="amber-400"
          @click="toast.warning('Warning', { showProgress: false })"
        >
          Warning
        </BracketButton>
        <BracketButton
          class="mr-2 bg-red-950/60"
          color="red-400"
          @click="toast.error('Error', { showProgress: false })"
        >
          Error
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">Persistent</span>
      <div>
        <BracketButton
          class="mr-2 bg-emerald-950/60"
          color="emerald-400"
          @click="toast.success('Success', { duration: 0 })"
        >
          Success
        </BracketButton>
        <BracketButton
          class="mr-2 bg-blue-950/60"
          color="blue-400"
          @click="toast.info('Info', { duration: 0 })"
        >
          Info
        </BracketButton>
        <BracketButton
          class="mr-2 bg-amber-950/60"
          color="amber-400"
          @click="toast.warning('Warning', { duration: 0 })"
        >
          Warning
        </BracketButton>
        <BracketButton
          class="mr-2 bg-red-950/60"
          color="red-400"
          @click="toast.error('Error', { duration: 0 })"
        >
          Error
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">With title</span>
      <div>
        <BracketButton
          class="mr-2 bg-emerald-950/60"
          color="emerald-400"
          @click="toast.success('Success', { title: 'Title' })"
        >
          Success
        </BracketButton>
        <BracketButton
          class="mr-2 bg-blue-950/60"
          color="blue-400"
          @click="toast.info('Info', { title: 'Title' })"
        >
          Info
        </BracketButton>
        <BracketButton
          class="mr-2 bg-amber-950/60"
          color="amber-400"
          @click="toast.warning('Warning', { title: 'Title' })"
        >
          Warning
        </BracketButton>
        <BracketButton
          class="mr-2 bg-red-950/60"
          color="red-400"
          @click="toast.error('Error', { title: 'Title' })"
        >
          Error
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">Positions</span>
      <div>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Top left', { position: 'top-left' })"
        >
          Top left
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Top center', { position: 'top-center' })"
        >
          Top center
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Top right', { position: 'top-right' })"
        >
          Top right
        </BracketButton>
      </div>
      <div>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Bottom left', { position: 'bottom-left' })"
        >
          Bottom left
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Bottom center', { position: 'bottom-center' })"
        >
          Bottom center
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Bottom right', { position: 'bottom-right' })"
        >
          Bottom right
        </BracketButton>
      </div>
      <div>
        <BracketButton class="mr-2 bg-gray-900/60" color="gray-400" @click="allPositions">
          All
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">Duration</span>
      <div>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('1s', { duration: 1000 })"
        >
          1 second
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('4s', { duration: 4000 })"
        >
          4 seconds
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('15s', { duration: 15000 })"
        >
          15 seconds
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">Pause on hover</span>
      <div>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('Pause', { pauseOnHover: true })"
        >
          Pause
        </BracketButton>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="toast.success('No pause', { pauseOnHover: false })"
        >
          No pause
        </BracketButton>
      </div>
    </div>
    <div class="*:pb-2">
      <span class="text-2xl">Action</span>
      <div>
        <BracketButton
          class="mr-2 bg-gray-900/60"
          color="gray-400"
          @click="
            toast.success('Dummy action', { action: { label: 'dummy action', onClick: () => {} } })
          "
        >
          Dummy action
        </BracketButton>
        <BracketButton
          class="mr-2 p-2 bg-gray-900/60"
          color="gray-400"
          @click="
            toast.success('Action with title', {
              title: 'Title',
              action: { label: 'dummy action', onClick: () => {} },
            })
          "
        >
          Dummy action
        </BracketButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
