<template>
  <div class="Card u-marginTopLarge">
    <div class="Card-coloredDiv" v-bind:style="{'background-color': color}"></div>
    <div class="Card-wrapper">
      <div class="Card-upper">
        <div class="Card-upper-icons">
          <input type="checkbox" :checked="false">
          <div>
            <i class="fas fa-cog fa-2x"></i>
            <b-dropdown variant="light" right class="custom-button-padding">
              <b-dropdown-item href="#">option</b-dropdown-item>
              <b-dropdown-item href="#">option</b-dropdown-item>
              <b-dropdown-item href="#">option</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <div>
          <h4>Meeting name</h4>
          <div>1.pm - 2.pm, 12 persons</div>
        </div>
      </div>
      <div class="Card-low">
        <div class="u-textPrimary">/mon, 16.8.19</div>
        <b-dropdown v-if="!this.$store.state.isAdmin" split text="Options" variant="outline-primary">
          <b-dropdown-item href="#">option</b-dropdown-item>
          <b-dropdown-item href="#">option</b-dropdown-item>
          <b-dropdown-item href="#">option</b-dropdown-item>
        </b-dropdown>
        <b-dropdown v-if="this.$store.state.isAdmin" split text="Edit" variant="outline-primary">
          <b-dropdown-item href="#">option</b-dropdown-item>
          <b-dropdown-item href="#">option</b-dropdown-item>
          <b-dropdown-item href="#">option</b-dropdown-item>
        </b-dropdown>
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
        margin-bottom: 0.8rem;
        display: flex;
        justify-content: space-between;
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