<style scoped>
label {
  padding: 20px 0px;
}
</style>
<template>
  <div class="frame-bar media-line"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px;`"
    @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)">
    <div style="margin-right: 10px; width:70px;margin-top:20px;">
      <i class="fa fa-video-camera"></i>
    </div>

    <div v-if="this.$store.state.set.selectedSettingTool === `trim`" class="div-range active"
      :style="`left: ${start}px; width:${width}px;`">
      <div class="left" @mousedown="resizeSelected($event, 0)"></div>
      <div class="text">
        <div v-for="i in currentImageCount"
          :style="`background:url(/frames/${this.$store.state.set.fileName}/${getFrameName(firstImage + parseInt(((lastImage - firstImage) / currentImageCount) * i))}.png);width:120px;height:67.5px;background-size:cover;overflow:hidden;`">
        </div>
      </div>
      <div class="right" @mousedown="resizeSelected($event, 1)" :style="`left: ${width - 10}px`"></div>
    </div>

    <div v-if="this.$store.state.set.selectedSettingTool !== `trim`" class="div-range "
      :style="`left: ${start}px; width:${width}px;`">
      <CutFrameBar :start="`${this.start}`" :width="`${this.width}`" />
      <div class="left"></div>
      <div class="text">
        <div v-for="i in currentImageCount"
          :style="`background:url(/frames/${this.$store.state.set.fileName}/${getFrameName(firstImage + parseInt(((lastImage - firstImage) / currentImageCount) * i))}.png);width:120px;height:67.5px;background-size:cover;overflow:hidden;`">
        </div>
      </div>
      <div class="right" :style="`left: ${width - 7}px`"></div>
    </div>

  </div>
</template>

<script>
import CutFrameBar from "./CutFrameBar.vue";
import { useStore } from "vuex";
import setStore from "../../store/modules/set.module";


export default {
  name: "FrameBar",
  components: {
    CutFrameBar
  },
  props: {
    zoom: Number,
    duration: Number
  },
  data() {
    return {
      start: 0,
      width: 200,
      resizeStart: 0,
      resizeState: false,
      resizeType: 0,
      imageCount: this.$store.state.set.fileCount,
      firstImage: 0,
      lastImage: this.$store.state.set.fileCount,
      currentImageCount: this.$store.state.set.fileCount,
      onlyDelay: 0
    };
  },
  watch: {
    "$store.state.set.delay": function (val, oldVal) {
      this.start = 100 * (val.mm * 6000 + val.ss * 100 + val.ss1) / (100 * (this.zoom - 6) * (-1));

    },
    width: function (newZoom, oldZoom) {
      this.updateImages();
    },
    zoom: function (newZoom, oldZoom) {
      //      this.start = this.start / oldZoom;
      this.width = 100 * (this.duration) / (100 * (newZoom - 6) * (-1));

      this.updateImages();
    },
    "$store.state.set.videoFrom": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
      var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      this.start = 100 * (from) / (100 * (this.zoom - 6) * (-1));
      this.width = 100 * (to - from) / (100 * (this.zoom - 6) * (-1));
    },
    "$store.state.set.videoTo": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
      var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      this.start = 100 * (from) / (100 * (this.zoom - 6) * (-1));
      this.width = 100 * (to - from) / (100 * (this.zoom - 6) * (-1));
    },
    // "$store.state.set.delay": function (newVal, oldVal) {
    //   //delay to pixel
    //   var delay = this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1;
    //   this.start = 100 * (delay) / (100 * (this.zoom - 6) * (-1));

    //   var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
    //   var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;

    //   var diff = (newVal.mm - oldVal.mm) * 6000 + (newVal.ss - oldVal.ss) * 100 + (newVal.ss1 - oldVal.ss1)

    //   this.width = 100 * (to - from - diff) / (100 * (this.zoom - 6) * (-1));


    // },
  },
  created() {
    const store = useStore();
    this.width = 100 * (this.duration) / (100 * (this.zoom - 6) * (-1));

    this.updateImages();

  },
  // computed: {
  //   getFrameName(value) {
  //     let str = "";
  //     for (let i = 0; i < 7; i++) {
  //       str += toString(value % 10);
  //       value = parseInt(value / 10);
  //     }
  //     let newstr = "";
  //     for (let i = 6; i >= 0; i--) {
  //       newstr += str[i];
  //     }
  //     return newstr;
  //   }
  // },
  methods: {

    getFrameName(value) {
      let str = "";
      for (let i = 0; i < 7; i++) {
        str += value % 10;
        value = parseInt(value / 10);
      }
      let newstr = "";
      for (let i = 6; i >= 0; i--) {
        newstr += str[i];
      }
      return newstr;
    },
    updateImages() {

      let oldWidth = 100 * (this.duration) / (100 * (this.zoom - 6) * (-1));

      this.firstImage = parseInt(
        this.imageCount * (this.onlyDelay / oldWidth)//count/width *120
      );
      this.lastImage = parseInt(
        this.imageCount * ((this.onlyDelay + this.width) / oldWidth)
      );
      this.currentImageCount = parseInt(this.width / 120) + 1;
    },
    resizeSelected(e, type) {
      var payload = { type: "relaseFlag", value: false }
      this.$store.dispatch("setData", payload);

      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;

    },
    resizeMoved(e) {


      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          //e.x-resizeStart + width > to -from ->px
          var to = 100 * (this.$store.state.set.to.mm * 6000 + this.$store.state.set.to.ss * 100 + this.$store.state.set.to.ss1) / (100 * (this.zoom - 6) * (-1));
          var from = 100 * (this.$store.state.set.from.mm * 6000 + this.$store.state.set.from.ss * 100 + this.$store.state.set.from.ss1) / (100 * (this.zoom - 6) * (-1));



          if (e.x - this.resizeStart + this.width > to - from) {
            this.resizeState = false;
            return;
          }

          if (this.width + e.x - this.resizeStart < 125) {
            this.resizeState = false;
            return;
          }
          this.width += e.x - this.resizeStart;
          this.updateImages();


          var videoEnd = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;

          var offset = parseInt((((e.x - this.resizeStart) / 100) * 100) * ((-1) * (this.zoom - 6)));

          videoEnd += offset;

          this.$store.dispatch("setData", {
            type: "videoTo",
            value: {
              mm: parseInt((videoEnd) / (100 * 60)),
              ss: parseInt(((videoEnd) % (100 * 60)) / 100),
              ss1: parseInt(((videoEnd) % (100 * 60)) % 100),
            },
          });

          this.$store.dispatch("setData", {
            type: "cutTo",
            value: {
              mm: parseInt((videoEnd) / (100 * 60)),
              ss: parseInt(((videoEnd) % (100 * 60)) / 100),
              ss1: parseInt(((videoEnd) % (100 * 60)) % 100),
            },
          });

        } else if (this.resizeType == 0) {
          //resizeStart -e.x + width > to -from


          var to = 100 * (this.$store.state.set.to.mm * 6000 + this.$store.state.set.to.ss * 100 + this.$store.state.set.to.ss1) / (100 * (this.zoom - 6) * (-1));
          var from = 100 * (this.$store.state.set.from.mm * 6000 + this.$store.state.set.from.ss * 100 + this.$store.state.set.from.ss1) / (100 * (this.zoom - 6) * (-1));


          if (this.resizeStart - e.x + this.width > to - from) {
            this.resizeState = false;
            return;
          }

          if (this.width - e.x + this.resizeStart < 125) {
            this.resizeState = false;
            return;
          }

          var videoStart = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;

          var offset = parseInt((((e.x - this.resizeStart) / 100) * 100) * ((-1) * (this.zoom - 6)));

          videoStart += offset;

          this.$store.dispatch("setData", {
            type: "videoFrom",
            value: {
              mm: parseInt((videoStart) / (100 * 60)),
              ss: parseInt(((videoStart) % (100 * 60)) / 100),
              ss1: parseInt(((videoStart) % (100 * 60)) % 100),
            },
          });

          this.$store.dispatch("setData", {
            type: "cutFrom",
            value: {
              mm: parseInt((videoStart) / (100 * 60)),
              ss: parseInt(((videoStart) % (100 * 60)) / 100),
              ss1: parseInt(((videoStart) % (100 * 60)) % 100),
            },
          });

          // var prevDelay = this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1;


          // this.$store.dispatch("setData", {
          //   type: "delay",
          //   value: {
          //     mm: parseInt((prevDelay + offset) / (100 * 60)),
          //     ss: parseInt(((prevDelay + offset) % (100 * 60)) / 100),
          //     ss1: parseInt(((prevDelay + offset) % (100 * 60)) % 100),
          //   },
          // });



          this.start += e.x - this.resizeStart;
          this.width -= e.x - this.resizeStart;
          this.updateImages();


        } else {
          return;

          if (this.start + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }
          this.start += e.x - this.resizeStart;


          var delay = parseInt((((e.x - this.resizeStart) / 100) * 100) * ((-1) * (this.zoom - 6)));

          var videoStart = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;

          var videoEnd = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;



          var prevDelay = this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1;
          prevDelay += delay;




          this.$store.dispatch("setData", {
            type: "delay",
            value: {
              mm: parseInt((prevDelay) / (100 * 60)),
              ss: parseInt(((prevDelay) % (100 * 60)) / 100),
              ss1: parseInt(((prevDelay) % (100 * 60)) % 100),
            },
          });

        }
        this.resizeStart = e.x;

      }

    },
    resizeReleased(e) {
      var payload = { type: "relaseFlag", value: true }
      this.$store.dispatch("setData", payload);

      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          if (this.width + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }

          this.width += e.x - this.resizeStart;
        } else if (this.resizeType == 0) {
          if (this.start + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }

          this.start += e.x - this.resizeStart;
          this.width -= e.x - this.resizeStart;
        } else {
          if (this.start + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }

          this.start += e.x - this.resizeStart;
        }
      }
      this.resizeState = false;
      this.updateImages();
    },
  },
};
</script>
<style scoped>
label {
  padding: 20px 0px;
}

.div-range {
  position: relative;
  left: 0px;
  width: 200px;
  text-indent: 0px;
  background-color: rgb(17, 67, 62);
  border-radius: 5px;
}

.left {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 0px;
  top: 0px;
  width: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.5);
}



.text {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}


.right {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 210px;
  top: 0px;
  width: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 5;
}


img {
  width: 110px;
}

.frame-bar {
  background-color: rgb(20, 20, 20);
  color: #FFFFFF;
  margin-top: 10px;
}

.frame-bar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active {
  /* border: solid 1px #1620FF; */
  border: solid 2px #FFFFFF;
}

.active>.text:hover {
  cursor: move;
}

.active>.left:hover {
  cursor: col-resize;
}

.active>.right:hover {
  cursor: col-resize;
}

.popup-div {
  position: absolute;

}


/* Popup container - can be anything you want */
.popup {
  position: relative;
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* The actual popup */
.popup .popuptext {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
}

/* Popup arrow */
.popup .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Toggle this class - hide and show the popup */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
