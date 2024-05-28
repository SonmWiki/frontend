<script setup lang="ts">
import { ModelRef, type Ref, ref, watch } from "vue"
import { maxLength, minLength, required } from "@vuelidate/validators"
import { wikiApi } from "@/service/WikiApiService"
import { useVuelidate } from "@vuelidate/core"
import { useToast } from "primevue/usetoast"
import router from "@/router"
import { ReviewStatus } from "@/api"
import { AppConstants } from "@/constants/AppConstants"

interface LabledReviewStatus {
  label: String,
  status: ReviewStatus
}

const revisionId = defineModel<string>("revisionId", { required: true })
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
  message: { maxLength: maxLength(1024) },
  selectedOption: { required }
}
const vuelidate = useVuelidate(
  rules, { message: message, selectedOption: selectedOption }, { $lazy: true }
)

const sendReview = async () => {
  try {
    const result = (await wikiApi.api.reviewArticleRevision(revisionId.value, {
      status: selectedOption.value.status,
      review: message.value
    })).data
    dialogVisible.value = false
    toast.add({ severity: "success", summary: "Review Submitted!", detail: `id: ${result.id}`, life: 3000 })

    //message.value = ""
    //selectedOption.value = reviewOptions[0]

    await router.push({ name: "review" })
  } catch (e) {
    toast.add({ severity: "error", summary: "An error occurred", detail: "Couldn't send the review", life: 3000 })
  }
}

watch(selectedOption, () =>{
  vuelidate.value.selectedOption.$touch()
})

watch(message, () =>{
  vuelidate.value.message.$touch()
})
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
        :class="{ 'p-invalid': vuelidate.selectedOption.$errors[0] }"
      />
      <label for="dropdown">Reviews status</label>
      <PrimeTag v-for="error in vuelidate.selectedOption.$errors" :key="error.$uid" severity="danger">
        {{ error.$message }}
      </PrimeTag>
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