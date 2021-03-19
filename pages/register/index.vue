<template>
  <div class="md-layout md-alignment-center" style="height: 100vh">
    <md-card class="md-layout-item md-size-50">
      <md-card-header class="md-title"> Register </md-card-header>

      <!-- Register Form -->
      <form @submit.prevent="validateForm">
        <md-card-content>
          <md-field md-clearable :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              :disabled="loading"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
            ></md-input>
            <span class="md-error" v-if="!$v.form.email.required"
              >The email is required</span
            ><span class="md-error" v-else-if="!$v.form.email.email"
              >Invalid email</span
            >
          </md-field>

          <md-field :class="getValidationClass('password')">
            <label for="password">Password</label>
            <md-input
              :disabled="loading"
              type="password"
              name="password"
              id="password"
              autocomplete="password"
              v-model="form.password"
            ></md-input>
            <span class="md-error" v-if="!$v.form.password.required"
              >The password is required</span
            >
            <span class="md-error" v-else-if="!$v.form.password.minLength"
              >Password is too short</span
            >
            <span class="md-error" v-else-if="!$v.form.password.maxLength"
              >Password is too long</span
            >
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button to="/login">Go to Login</md-button>
          <md-button
            type="submit"
            :disabled="loading"
            class="md-primary md-raised"
            >Submit</md-button
          >
        </md-card-actions>
      </form>
      <md-snackbar :md-active.sync="isAuthenticated">
        {{ form.email }} was successfully registered
      </md-snackbar>
    </md-card>
  </div>
</template>
    
<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  middleware: 'auth',
  mixins: [validationMixin],
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    }
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20),
      },
    },
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
  watch: {
    //watch the value passed from the computed area's isAuthenticated method, only execute if that returned value is true
    isAuthenticated(value) {
      if (value) {
        setTimeout(() => this.$router.push('/'), 2000)
      }
    },
  },
  methods: {
    validateForm() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.registerUser()
      }
    },
    async registerUser() {
      await this.$store.dispatch('authenticateUser', {
        action: 'register',
        email: this.form.email,
        password: this.form.password,
        returnSecureToken: true,
      })
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        }
      }
    },
  },
}
</script>

<style>
</style>
