<template>
  <div :class="`panel-group sub-tool-component ${active} ${mouseOverd}`" @click="toolBoxOpen()"
    @mouseover="mouseoverd($event)" @mouseout="mouseouted($event)">
    <h4 class="panel-title">
      <a v-if="toolType === `trim`" style="color:#FFFFFF;margin-left:13%;"><i class="fa fa-cut fa-1x tooltip"><span
            class="tooltiptext">トリミング</span></i></a>
      <a v-if="toolType === `shape`" style="color:#FFFFFF;margin-left:13%;"><i class="fa fa-braille fa-1x tooltip"><span
            class="tooltiptext">図形</span></i></a>
      <a v-if="toolType === `text`" style="color:#FFFFFF;margin-left:13%;"><i class="fa fa-file-text fa-1x tooltip"><span
            class="tooltiptext">字幕</span></i></a>
      <a v-if="toolType === `audio`" style="color:#FFFFFF;margin-left:13%;"><i
          class="fa fa-microphone fa-1x tooltip"><span class="tooltiptext">音声</span></i></a>
      <a v-if="toolType === `cut`" style="margin-left:13%;"><i class="fa fa-cut fa-1x tooltip"
          style="color:red;opacity:0.8;font-size:18px;"><span class="tooltiptext">カット</span></i></a>
    </h4>
  </div>
</template>

<script >
import { useStore } from "vuex";
import setStore from '../../store/modules/set.module';
export default {
  name: 'SubTool',
  props: {
    toolType: String,
    active: String
  },
  data() {
    return {
      mouseOverd: ''
    }
  },
  emits: ["subToolSelect"],
  methods: {
    toolBoxOpen: function () {
      this.$emit("subToolSelect");
    },
    mouseoverd: function (e) {
      this.mouseOverd = 'mouse-overd';
    },
    mouseouted: function (e) {
      this.mouseOverd = '';
    }
  }
}
</script>
<style scoped>
.fa {
  color: rgba(255, 255, 255, 0.8);
}

.mouse-overd {
  background-color: rgb(48, 48, 48);
  cursor: pointer;
}

.tooltip {
  position: relative;
  display: inline-block;
  padding: 0px;
  opacity: 1;
  font-size: 16px;
  margin-top: 18px;

}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 100px;
  background-color: rgb(16, 16, 16);
  border: solid 1px #FFFFFF;
  color: #fff;
  padding: 5px 0;
  border-radius: 6px;

  position: absolute;
  z-index: 1;
  bottom: 125%;
  margin-left: -25px;

  opacity: 0;
  transition: opacity 0.3s;

  font-size: 15px;
  text-align: center;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 25%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>