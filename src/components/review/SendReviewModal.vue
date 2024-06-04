<script setup lang="ts">
import { ref } from "vue"
import { maxLength, required } from "@vuelidate/validators"
import { wikiApi } from "@/service/WikiApiService"
import { useVuelidate } from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import { ReviewStatus } from "@/api"
import { AppConstants } from "@/constants/AppConstants"

interface LabledReviewStatus {
  label: String,
  status: ReviewStatus
}

const props = defineProps<{
  revisionId: string
}>()

const emit = defineEmits<{
  reviewSent: []
}>()

const dialogVisible = defineModel<boolean>("dialogVisible", {default: false})
const message = ref("")
const toast = useToast()

const reviewOptions: Array<LabledReviewStatus> = [
  { label: "Remove", status: ReviewStatus.Removed },
  { label: "Reject", status: ReviewStatus.Rejected },
  { label: "Accept", status: ReviewStatus.Accepted }
]
const selectedOption = ref<LabledReviewStatus>(reviewOptions[0])

const rules = {
  message: { required, maxLength: maxLength(1024) },
}
const vuelidate = useVuelidate(rules, { message: message })
vuelidate.value.$touch()

const sendReview = async () => {
  try {
    const result = (await wikiApi.api.reviewArticleRevision(props.revisionId, {
      status: selectedOption.value.status,
      review: message.value
    })).data
    dialogVisible.value = false
    toast.add({ severity: "success", summary: "Review Submitted!", detail: `id: ${result.id}`, life: 3000 })
    onReviewSent()
  } catch (e) {
    toast.add({ severity: "error", summary: "An error occurred", detail: "Couldn't send the review", life: 3000 })
  }
}

const onReviewSent = () => {
  emit("reviewSent")
}

</script>

<template>
  <PrimeDialog
    v-model:visible="dialogVisible"
    modal
    maximizable
    header="Review article revision"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
  >
    <PrimeFloatLabel class="mt-5">
      <PrimeDropdown
        id="dropdown"
        v-model="selectedOption"
        option-label="label"
        :options="reviewOptions"
        placeholder="Select a Status"
        class="w-full md:w-14rem"
      />
      <label for="dropdown">Reviews status</label>
    </PrimeFloatLabel>
    <PrimeFloatLabel class="mt-5">
      <PrimeTextarea
        id="message"
        v-model="message"
        rows="5"
        cols="30"
        class="w-full h-8rem"
        :class="{ 'p-invalid': vuelidate.message.$errors[0] }"
      />
      <label for="message">Message</label>
      <PrimeTag v-for="error in vuelidate.message.$errors" :key="error.$uid" severity="danger">
        {{ error.$message }}
      </PrimeTag>
    </PrimeFloatLabel>
    <div class="flex justify-content-end gap-2 w-full mt-2">
      <PrimeButton
        type="button"
        label="Cancel"
        severity="secondary"
        @click="dialogVisible = false"
      />
      <PrimeButton
        type="button"
        label="Submit"
        :disabled="vuelidate.$error"
        @click="sendReview()"
      />
    </div>
  </PrimeDialog>
</template>

<style scoped>

</style>