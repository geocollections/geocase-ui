<template>
  <div class="AnimateNumber">{{ animateNumber }}</div>
</template>

<script>
export default {
  name: "AnimateNumber",
  props: {
    number: {
      type: String,
      required: true
    },
    isVeryLarge: Boolean,
    isVerySmall: Boolean
  },
  data: () => ({
    animateNumber: 0
  }),
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      let multiplier = 100;
      let intervalTimeout = 10;
      if (this.isVeryLarge) multiplier = 9000;
      if (this.isVerySmall) {
        multiplier = 1;
        intervalTimeout = 300;
      }

      let intervalId = setInterval(
        () => (this.animateNumber += Math.round(Math.random() * multiplier)),
        intervalTimeout
      );

      setTimeout(() => {
        clearInterval(intervalId);
        this.animateNumber = this.number;
      }, 3000);
    }
  }
};
</script>

<style scoped></style>
