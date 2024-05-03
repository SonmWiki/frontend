<script setup lang="ts">
import { ModelRef, ref } from "vue"
import { maxLength, minLength, required } from "@vuelidate/validators"
import { wikiApi } from "@/service/WikiApiService"
import { useVuelidate } from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import router from "@/router"

const revisionId: ModelRef<string> = defineModel("revisionId")
const dialogVisible: ModelRef<boolean> = defineModel("dialogVisible")

const toast = useToast()

const error = ref()
const message = ref("")
const status = ref()

const rules = {
  message: { required, minLength: minLength(4), maxLength: maxLength(1024) },
  status: { required }
}

const v$ = useVuelidate(
  rules, { message: message, status: status }, { $lazy: true }
)

const reviewStatus = [
  { status: "Removed", code: 0 },
  { status: "Rejected", code: 1 },
  { status: "Accepted", code: 2 }
]

const sendReview = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  try {
    const result = (await wikiApi.api.reviewArticleRevision(revisionId.value, {
      status: status.value.code,
      review: message.value
    })).data
    dialogVisible.value = false
    toast.add({ severity: "success", summary: "Review Submitted!", detail: `id: ${result.id}`, life: 3000 })

    message.value = ""
    status.value = undefined

    await router.push({ name: "review" })
  } catch (e) {
    error.value = e
    console.log(e)
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="dialogVisible"
    modal
    header="Article Review"
    class="w-30rem"
  >
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2">
        <label for="status">Status</label>
        <PrimeDropdown
          v-model="status"
          :options="reviewStatus"
          option-label="status"
          placeholder="Select a Status"
          class="w-full md:w-14rem"
          :class="{ 'p-invalid': v$.status.$errors[0] }"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label for="message">Message</label>
        <PrimeTextarea
          id="message"
          v-model="message"
          rows="5"
          cols="30"
          class="w-full h-8rem"
          :class="{ 'p-invalid': v$.message.$errors[0] }"
        />
        <div class="text-sm text-color-secondary">
          Rev. {{ revisionId }}
        </div>
      </div>
      <span v-if="error" class="text-red-400">
        ❗ Failed to Submit: {{ error.request.statusText }}
      </span>
      <div class="flex justify-content-end gap-2">
        <PrimeButton
          outlined
          type="button"
          label="Cancel"
          severity="secondary"
          @click="dialogVisible = false"></PrimeButton>
        <PrimeButton
          outlined
          type="button"
          label="Submit"
          @click="sendReview()"></PrimeButton>
      </div>
    </div>
  </PrimeDialog>
</template>

<style scoped>

</style>