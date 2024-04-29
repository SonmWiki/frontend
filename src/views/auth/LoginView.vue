<script setup lang="ts">
import { ref } from "vue"
import { useToast } from "primevue/usetoast"
import { maxLength, minLength, required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"

const toast = useToast()

const login = ref("")
const password = ref("")

const rules = {
  password: { required, minLength: minLength(8), maxLength: maxLength(48) },
  login: { required, minLength: minLength(4) }
}

const v$ = useVuelidate(rules, { login: login, password: password }, { $lazy: true })

const onSubmit = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return
  toast.add({ severity: "info", summary: "Form Submitted", life: 3000 })
}

</script>


<template>

  <div class="card flex justify-content-center flex-column align-items-center text-center">
    <Card>
      <template #title>
        Login
      </template>

      <template #content>
        <form class="flex flex-column align-items-center gap-3" @submit.prevent="onSubmit">

          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user" />
            </InputGroupAddon>
            <InputText
              v-model="login"
              v-tooltip.right="v$.login.$errors[0]?.$message || ''"
              :class="{ 'p-invalid': v$.login.$errors[0] }"
              placeholder="Login"
            />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock" />
            </InputGroupAddon>
            <Password
              v-model="password"
              v-tooltip.right="v$.password.$errors[0]?.$message || ''"
              :feedback="false"
              toggle-mask
              :class="{ 'p-invalid': v$.password.$errors[0] }"
              placeholder="Password"
            />
          </InputGroup>

          <Button type="submit" label="Submit" />

          <div class="flex flex-column">
            <small>
              Don't have an account yet?
              <RouterLink to="/register" class="link-primary">Register</RouterLink>
            </small>
            <small>
              Forgot your password?
              <RouterLink to="/register" class="link-primary">Reset password</RouterLink>
            </small>
          </div>
        </form>

        <Toast />
      </template>

    </Card>
  </div>
</template>


<style scoped>

</style>
