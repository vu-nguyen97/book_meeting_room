<template>
  <div v-if="isShowSpinner" class="Spinner"></div>
</template>

<script>
  export default {
    name: 'Spinner',
    props: {
      isShowSpinner: Boolean
    },
  }
</script>

<style lang="scss" scoped>
.Spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  border: 5px solid #eee;
  display: inline-block;
  
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
  &:after, &:before {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  &:after {
    position: absolute;
    top: -5px;
    left: -5px;
    border: 5px solid transparent;
    border-top-color: #928a8a;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
}
</style>