<template>
  <div id="clock">
    <span class="time">{{ time }}</span>
    <!-- <div class="btn-container">
      <a @click="start">Start</a>
    </div> -->
  </div>
</template>

<script>
export default {
  mounted() {
    this.start();
  },
  data() {
    return {
      time: "00:00:00",
      timeBegan: null,
      stoppedDuration: 0,
      started: null,
      running: false,
    };
  },
  methods: {
    start() {
      this.timeBegan = new Date();
      this.running = true;
      this.started = setInterval(this.clockRunning, 1000);
    },
    clockRunning() {
      let currentTime = new Date(),
        timeElapsed = new Date(
          currentTime - this.timeBegan - this.stoppedDuration
        ),
        hour = timeElapsed.getUTCHours(),
        min = timeElapsed.getUTCMinutes(),
        sec = timeElapsed.getUTCSeconds();

      this.time =
        this.zeroPrefix(hour, 2) +
        ":" +
        this.zeroPrefix(min, 2) +
        ":" +
        this.zeroPrefix(sec, 2);
    },
    zeroPrefix(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
  },
};
</script>

<style>
</style>
