<script setup lang="ts">
import {useToast} from "primevue/usetoast";
import {email, maxLength, minLength, required, sameAs} from '@vuelidate/validators'
import {useVuelidate} from '@vuelidate/core'
import {ref} from "vue";

const toast = useToast();
const visibleTerms = ref(false);

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const readTerms = ref('');
const mail = ref('');

const rules = {
  username: {required, minLength: minLength(4), maxLength: maxLength(16)},
  email: {email, required,},
  password: {required, minLength: minLength(8), maxLength: maxLength(48)},
  confirmPassword: {required, sameAsPassword: sameAs(password)},
  readTerms: {required, sameAs: sameAs(true)},
}
const v$ = useVuelidate(
    rules, {
      username: username, email: mail, password: password,
      confirmPassword: confirmPassword, readTerms: readTerms
    }, {$lazy: true}
)

const onSubmit = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  console.log("sending")

  toast.add({severity: 'info', summary: 'Form Submitted', life: 3000})
};

</script>


<template>

  <div class="card flex justify-content-center flex-column align-items-center text-center">
    <Card>
      <template #title>
        Register
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-column align-items-center gap-3">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText v-tooltip.right="v$.username.$errors[0]?.$message || ''" v-model="username"
                       :class="{ 'p-invalid': v$.username.$errors[0] }" placeholder="Username"/>
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-at"></i>
            </InputGroupAddon>
            <InputText v-tooltip.right="v$.email.$errors[0]?.$message || ''" type="email" v-model="mail"
                       :class="{ 'p-invalid': v$.email.$errors[0] }" placeholder="Email"/>
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <Password toggleMask v-tooltip.right="v$.password.$errors[0]?.$message || ''" v-model="password"
                      :class="{ 'p-invalid': v$.password.$errors[0] }" placeholder="Password" />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <InputText v-tooltip.right="v$.confirmPassword.$errors[0]?.$message || ''" v-model="confirmPassword"
                       :class="{ 'p-invalid': v$.confirmPassword.$errors[0] }" placeholder="Confirm Password"
                       type="password"/>
          </InputGroup>

          <div>
            <Checkbox :binary="true" :class="{ 'p-invalid': v$.readTerms.$errors[0] }" v-model="readTerms"
                      aria-describedby="text-error"/>
            * I've read and accept the <span @click="visibleTerms = true" class="link-primary">terms & conditions</span>
          </div>

          <Button type="submit" label="Submit"/>

          <div>
            <small>
              Already have an account? <RouterLink to='/login' class="link-primary">Login</RouterLink>
            </small>
          </div>
        </form>

      <Toast/>

      <Dialog v-model:visible="visibleTerms" modal header="Terms & Conditions" :style="{ width: '50rem' }"
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="mb-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <p class="mb-5">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          Nemo enim
          ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
          ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur,
          adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
          voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
          aliquid
          ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
          molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>
        <p class="mb-5">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
          atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
          sunt in culpa
          qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
          expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id
          quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
          quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et
          molestiae
          non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
          alias consequatur aut perferendis doloribus asperiores repellat.
        </p>
        <p class="mb-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <p class="mb-5">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          Nemo enim
          ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
          ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur,
          adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
          voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
          aliquid
          ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
          molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
          atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
          sunt in culpa
          qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
          expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id
          quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
          quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et
          molestiae
          non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
          alias consequatur aut perferendis doloribus asperiores repellat.
        </p>
      </Dialog>
      </template>
    </Card>
  </div>
</template>


<style scoped>

</style>
