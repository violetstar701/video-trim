<template>
  <div class="tControl">
    <label style="font-weight:bold">{{ this.$store.state.set.curTime.mm }}:{{
      this.$store.state.set.curTime.ss
    }}.{{
  this.$store.state.set.curTime.ss1
}}</label>/<label>{{ this.$store.state.set.duration.mm }}:{{ this.$store.state.set.duration.ss }}.{{
  this.$store.state.set.duration.ss1 }}</label>
  </div>
</template>

<script>
import Timepicker from "vue3-timepicker";
import { useStore } from "vuex";
import setStore from "../../store/modules/set.module";

export default {
  name: "TimeController",
};
</script>
<style scoped>
.tControl {
  margin-left: 20px;
  border: solid 1px rgb(16, 16, 16);
  width: 200px;
  background-color: rgb(16, 16, 16);
  color: #FFFFFF;
  padding: 0px 10px;
  border-radius: 10px;
}

.tControl input {
  border: none;
  width: 25px;
  background-color: rgb(16, 16, 16);
  color: #FFFFFF;
}

.tControl input:focus {
  border: none;
}

.tControl input:active {
  border: none;
}

.tControl input:valid {
  border: none;
}

.tControl input:visited {
  border: none;
}
</style>
