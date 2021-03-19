<template>
  <div class="md-layout md-alignment-center">
    <!-- Top Navigation -->
    <md-toolbar elevation="1" class="fixed-toolbar">
      <md-button @click="showLeftSidePanel = true" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <div class="logo">
        <img src="~/assets/images/lo.png" alt="logo" />
      </div>
      <nuxt-link class="md-primary md-title title" to="/">
        Ejukate News
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <template v-if="isAuthenticated">
          <md-button>
            <md-avatar> <img :src="user.avatar" :alt="user.email" /> </md-avatar
            >{{ user.email }}
          </md-button>
          <md-button @click="logoutUser">Logout</md-button>
        </template>
        <template v-else>
          <md-button to="/login">Login</md-button>
          <md-button to="/register">Register</md-button>
        </template>

        <md-button class="md-accent" @click="showRightSidePanel = true"
          >Categories</md-button
        >
      </div>
    </md-toolbar>
    <!-- Personal News feed (Ledt drawer)-->
    <md-drawer v-if="false" md-fixed :md-active.sync="showLeftSidePanel">
      <md-toolbar md-elevation="1">
        <span class="md-title">Personal Feed</span>
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
      <md-field>
        <label for="country">Country</label>
        <md-select
          @input="changeCountry"
          :value="country"
          name="country"
          id="country"
        >
          <md-option value="za">South Africa</md-option>
          <md-option value="us">United States</md-option>
          <md-option value="ca">Canada</md-option>
          <md-option value="gb">United Kingdom</md-option>
          <md-option value="de">Germany</md-option>
          <md-option value="ru">Russia</md-option>
        </md-select>
      </md-field>
    </md-drawer>

    <!-- News Categories (Right Drawer) -->
    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidePanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
      <md-list>
        <md-subheader class="md-primary">Categories</md-subheader>
        <md-list-item
          v-for="(newsCategory, id) in newsCategories"
          :key="id"
          @click="loadCategory(newsCategory.path)"
        >
          <md-icon
            :class="newsCategory.path === category ? 'md-primary' : ''"
            >{{ newsCategory.icon }}</md-icon
          >
          <span class="md-list-item-text"> {{ newsCategory.name }} </span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!-- App content -->
    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter content">
        <ul
          v-for="headline in headlines"
          :key="headline.id"
          class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        >
          <md-card class="md-card card">
            <md-ripple>
              <md-card-media class="card-image" md-ratio="16:9">
                <img :src="headline.urlToImage" :alt="headline.title" />
              </md-card-media>
              <md-card-header>
                <div class="md-title">
                  <a class="card-header" :href="headline.url" target="_blank"
                    >{{ headline.title }}
                  </a>
                </div>
                <div>
                  {{ headline.source.name }}
                  <md-icon class="small-icon">book</md-icon>
                </div>
                <div class="md-subhead" v-if="headline.author">
                  {{ headline.author }}
                  <md-icon class="small-icon"> face </md-icon>
                </div>
                <div class="md-subhead">
                  {{ headline.publishedAt }}
                  <md-icon class="small-icon"> alarm </md-icon>
                </div>
              </md-card-header>
              <md-card-content>{{ headline.description }}</md-card-content>
              <md-card-actions>
                <md-button class="md-icon">
                  <md-icon>bookmark</md-icon>
                </md-button>
                <md-button class="md-icon">
                  <md-icon>message</md-icon>
                </md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>
        </ul>
      </md-content>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRightSidePanel: false,
      showLeftSidePanel: false,
      newsCategories: [
        { name: 'Top Headlines', path: '', icon: 'today' },
        { name: 'Technology', path: 'technology', icon: 'keyboard' },
        { name: 'Business', path: 'business', icon: 'business_center' },
        { name: 'Entertainment', path: 'entertainment', icon: 'weekend' },
        { name: 'Health', path: 'health', icon: 'fastfood' },
        { name: 'Science', path: 'science', icon: 'fingerprint' },
        { name: 'Sports', path: 'sports', icon: 'golf_course' },
      ],
    }
  },
  async fetch({ store }) {
    await store.dispatch(
      'loadHeadlines',
      `/api/top-headlines?country=${store.state.country}&category=${store.state.category}`
    )
  },
  watch: {
    //watches for any changes
    //Execute loadHeadlines whenever the country changes
    async country() {
      await this.$store.dispatch(
        'loadHeadlines',
        `/api/top-headlines?country=${this.country}&category=${this.category}`
      )
    },
  },
  computed: {
    headlines() {
      return this.$store.getters.headlines
    },
    category() {
      return this.$store.getters.category
    },
    loading() {
      return this.$store.getters.loading
    },
    country() {
      return this.$store.getters.country
    },
    user() {
      return this.$store.getters.user
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
  methods: {
    async loadCategory(category) {
      this.$store.commit('setCategory', category)
      //Fetches our headlines based on category
      await this.$store.dispatch(
        'loadHeadlines',
        `/api/top-headlines?country=${this.country}&category=${this.category}`
      )
    },
    changeCountry(country) {
      this.$store.commit('setCountry', country)
    },
    logoutUser() {
      this.$store.dispatch('logoutUser')
    },
  },
}
</script>

<style lang="scss" >
.content {
  background: rgb(38, 40, 41);
  padding: 1em;
  margin-top: 4em;
}
.card {
  margin-top: 1em;
  border-radius: 10px;
  .card-header {
    text-decoration: none;
    color: rgb(59, 119, 143);
  }
  &:hover {
    background-color: rgb(32, 39, 39);
    opacity: 0.9;
  }
}
.small-icon {
  font-size: 18px !important;
}
.fixed-toolbar {
  position: fixed;
  top: 0;
  z-index: 5;
}
.logo {
  height: 30px;
  width: 30px;
  margin-left: 10px;
}
.card-image {
  border-radius: 10px;
}
</style>
