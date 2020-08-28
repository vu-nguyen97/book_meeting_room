<template>
  <div class="Card u-marginTopLarge">
    <div class="Card-coloredDiv" v-bind:style="{'background-color': color}"></div>
    <div class="Card-wrapper">
      <div class="Card-upper">
        <div class="Card-upper-icons mb-5">
          <input type="checkbox" :checked="false">
          <div class="u-flexCenter">
            <i class="fas fa-cog fa-2x"></i>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >keyboard_arrow_down</v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="(option, index) in options"
                  :key="index"
                  @click="handeClick(option)"
                >
                  <v-list-item-title>{{ option }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <div>
          <h4>Meeting name</h4>
          <div>1.pm - 2.pm, 12 persons</div>
        </div>
      </div>
      <div class="Card-low">
        <div class="u-textPrimary">/mon, 16.8.19</div>
        <v-menu offset-y
          v-if="!this.$store.state.isAdmin"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              Options
              <v-icon class="ml-1">keyboard_arrow_down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(option, index) in options"
              :key="index"
              @click="handeClick(option)"
            >
              <v-list-item-title>{{ option }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu offset-y
          v-if="this.$store.state.isAdmin"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              Edit
              <v-icon class="ml-1">keyboard_arrow_down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(option, index) in options"
              :key="index"
              @click="handeClick(option)"
            >
              <v-list-item-title>{{ option }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    isAdmin: {
      value: Boolean,
      default: false
    },
    color: String
  },
  data() {
    return {
      options: ['option1', 'option2', 'option3']
    }
  },
  methods: {
    handeClick(option) {
      console.log('click:', option)
    }
  },
}
</script>

<style scoped lang="scss">
  .Card {
    $colored-div-height: 8px;

    position: relative;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    // padding-bottom: calc( 19 / 30 * 100% );
    border-radius: 0.5rem;

    &-wrapper {
      // position: absolute;
      // width: 100%;
      // height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &-coloredDiv {
      height: $colored-div-height;
      border-top-left-radius: $colored-div-height;
      border-top-right-radius: $colored-div-height;
      opacity: 0.6;
    }

    &-upper {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &-icons {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    &-low {
      border-top: 1px solid #e1e1e1;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
    }
  }

  input[type=checkbox] {
    zoom: 1.5;
  }
</style>
