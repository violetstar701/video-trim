<style scoped>
label {
  padding: 20px 0px;
}
</style>

<template>
  <div class="audio-bar media-line"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px`"
    @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)">
    <div style="margin-right: 10px; width:70px;margin-top:10px;">
      <i class="fa fa-microphone"></i>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool === `audio`"
      v-for="(audio, id) in this.$store.state.upload.audios" :key="id" :class="`div-range ${this.active[id]}`"
      :style="`left: ${this.start[id] + 80}px; width:${this.width[id]}px;`">
      <div v-if="this.active[id] === `active`" class="text" @click="selectItem(id)" @contextmenu="onContextMenu($event)"
        @mousedown="resizeSelected($event, 2, id)"><i class="fa fa-microphone"></i></div>

      <div v-if="this.active[id] === `inactive`" class="text" @click="selectItem(id)"
        @mousedown="resizeSelected($event, 2, id)"><i class="fa fa-microphone"></i></div>

    </div>
    <div id="context-menu-audio">
      <div class="item" @click="del_audio()">Delete</div>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool !== `audio`"
      v-for="(audio, id) in this.$store.state.upload.audios" :key="id" class="div-range"
      :style="`left: ${this.start[id] + 80}px; width:${this.width[id]}px;`">
      <div class="text"><i class="fa fa-microphone"></i></div>
    </div>
  </div>
</template>

<script>
import setStore from "../../store/modules/set.module";

export default {
  name: "AudioBar",
  props: {
    zoom: Number,
  },
  data() {
    return {
      start: [],
      width: [],
      resizeStart: 0,
      resizeState: false,
      resizeType: 0,
      resizeId: 0,
      active: []
    };
  },
  mounted() {
    var start = [], width = [], active = [];


    for (var i = 0; i < this.$store.state.upload.audios.length; i++) {
      start.push(100 * (this.$store.state.upload.audios[i].value.from.mm * 6000 + this.$store.state.upload.audios[i].value.from.ss * 100 + this.$store.state.upload.audios[i].value.from.ss1) / (100 * (this.zoom - 6) * (-1)));

      width.push(100 * (this.$store.state.upload.audios[i].value.to.mm * 6000 + this.$store.state.upload.audios[i].value.to.ss * 100 + this.$store.state.upload.audios[i].value.to.ss1 - this.$store.state.upload.audios[i].value.from.mm * 6000 - this.$store.state.upload.audios[i].value.from.ss * 100 - this.$store.state.upload.audios[i].value.from.ss1) / (100 * (this.zoom - 6) * (-1)));

      active.push("inactive");
    }
    this.start = start;
    this.width = width;
    this.active = active;


    window.addEventListener('keydown', this.delAudio);
    window.addEventListener("click", (e) => {
      if (document.getElementById("context-menu-audio")) {
        const contextMenu = document.getElementById("context-menu-audio");
        if (e.target.offsetParent != contextMenu) {
          contextMenu.className = "none";
        }
      }
    });

  },
  watch: {
    zoom: function (newZoom, oldZoom) {
      this.start = this.start / oldZoom;
      this.width = this.width / oldZoom;
      this.start = this.start * newZoom;
      this.width = this.width * newZoom;


    },
    "$store.state.upload.audios.length": function (newZoom, oldZoom) {
      var start = [], width = [], active = [];

      for (var i = 0; i < this.$store.state.upload.audios.length; i++) {
        start.push(100 * (this.$store.state.upload.audios[i].value.from.mm * 6000 + this.$store.state.upload.audios[i].value.from.ss * 100 + this.$store.state.upload.audios[i].value.from.ss1) / (100 * (this.zoom - 6) * (-1)));

        width.push(100 * (this.$store.state.upload.audios[i].value.to.mm * 6000 + this.$store.state.upload.audios[i].value.to.ss * 100 + this.$store.state.upload.audios[i].value.to.ss1 - this.$store.state.upload.audios[i].value.from.mm * 6000 - this.$store.state.upload.audios[i].value.from.ss * 100 - this.$store.state.upload.audios[i].value.from.ss1) / (100 * (this.zoom - 6) * (-1)));

        active.push("inactive");

      }
      this.start = start;
      this.width = width;
      this.active = active;
    },
  },

  methods: {
    onContextMenu: function (event) {

      if (this.$store.state.set.selectedSettingTool !== "audio")
        return;



      event.preventDefault();

      const { clientX: mouseX, clientY: mouseY } = event;

      const contextMenu = document.getElementById("context-menu-audio");
      contextMenu.style.top = `${mouseY}px`;
      contextMenu.style.left = `${mouseX}px`;

      contextMenu.className = "none";

      setTimeout(() => {
        contextMenu.className = "visible";
      });

    },
    delAudio(event) {
      //      alert(event.which);
      if (event.which !== 46)
        return;
      var id = 0, flag = 0;
      for (var i = 0; i < this.active.length; i++) {
        if (this.active[i] === "active") {
          id = i; flag = 1;
          break;
        }
      }

      if (!flag)
        return;

      if (this.$store.state.set.selectedSettingTool !== "audio")
        return;

      if (this.active[id] !== "active")
        return;




      var audios = this.$store.state.upload.audios;
      // console.log("id,  length", id, this.active.length);
      // console.log("id,  length", id, audios);

      var payload;

      if (id == this.active.length - 1) {
        if (id == 0) {
          payload = {
            type: "audioFrom", value: {
              mm: 0,
              ss: 0,
              ss1: 0,
            }
          };
          this.$store.dispatch("setData", payload);



          payload = {
            type: "audioTo", value: {
              mm: 0,
              ss: 0,
              ss1: 0,
            }
          };
          this.$store.dispatch("setData", payload);
        }
        else {
          payload = {
            type: "audioFrom", value: {
              mm: this.$store.state.upload.audios[id - 1].value.from.mm,
              ss: this.$store.state.upload.audios[id - 1].value.from.ss,
              ss1: this.$store.state.upload.audios[id - 1].value.from.ss1,
            }
          };
          this.$store.dispatch("setData", payload);



          payload = {
            type: "audioTo", value: {
              mm: this.$store.state.upload.audios[id - 1].value.to.mm,
              ss: this.$store.state.upload.audios[id - 1].value.to.ss,
              ss1: this.$store.state.upload.audios[id - 1].value.to.ss1,
            }
          };
          this.$store.dispatch("setData", payload);
        }

      }


      audios.splice(id, 1);

      payload = { type: "audios", value: audios };


      this.$store.dispatch("updateToUploadDatas", payload);

    },
    del_audio() {

      var id = 0, flag = 0;
      for (var i = 0; i < this.active.length; i++) {
        if (this.active[i] === "active") {
          id = i; flag = 1;
          break;
        }
      }

      if (!flag)
        return;

      if (this.$store.state.set.selectedSettingTool !== "audio")
        return;

      if (this.active[id] !== "active")
        return;




      var audios = this.$store.state.upload.audios;
      // console.log("id,  length", id, this.active.length);
      // console.log("id,  length", id, audios);

      var payload;

      if (id == this.active.length - 1) {
        if (id == 0) {
          payload = {
            type: "audioFrom", value: {
              mm: 0,
              ss: 0,
              ss1: 0,
            }
          };
          this.$store.dispatch("setData", payload);



          payload = {
            type: "audioTo", value: {
              mm: 0,
              ss: 0,
              ss1: 0,
            }
          };
          this.$store.dispatch("setData", payload);
        }
        else {
          payload = {
            type: "audioFrom", value: {
              mm: this.$store.state.upload.audios[id - 1].value.from.mm,
              ss: this.$store.state.upload.audios[id - 1].value.from.ss,
              ss1: this.$store.state.upload.audios[id - 1].value.from.ss1,
            }
          };
          this.$store.dispatch("setData", payload);



          payload = {
            type: "audioTo", value: {
              mm: this.$store.state.upload.audios[id - 1].value.to.mm,
              ss: this.$store.state.upload.audios[id - 1].value.to.ss,
              ss1: this.$store.state.upload.audios[id - 1].value.to.ss1,
            }
          };
          this.$store.dispatch("setData", payload);
        }

      }


      audios.splice(id, 1);

      payload = { type: "audios", value: audios };


      this.$store.dispatch("updateToUploadDatas", payload);

      const contextMenu = document.getElementById("context-menu-audio");
      contextMenu.className = "none";

    },
    selectItem(id) {
      for (var i = 0; i < this.active.length; i++) {
        this.active[i] = "inactive";
      }
      this.active[id] = "active";
    },
    resizeSelected(e, type, id) {
      if (this.$store.state.set.selectedSettingTool !== 'audio')
        return;

      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;
      this.resizeId = id;
    },
    resizeMoved(e) {
      if (this.$store.state.set.selectedSettingTool !== 'audio')
        return;

      const timeToObject = value => {
        return {
          mm: Math.trunc(value / 6000),
          ss: Math.trunc((value % 6000) / 100),
          ss1: Math.trunc((value % 6000) % 100)
        }
      }

      const objectToTime = value => {
        return value.mm * 6000 + value.ss * 100 + value.ss1;
      }

      const pixelToTime = pixel => {
        return parseInt(((pixel / 100) * 100) * ((-1) * (this.zoom - 6)));
      }

      const update = (type, value, index) => {
        var audios = this.$store.state.upload.audios;

        var time = pixelToTime(value);

        var timeObject = timeToObject(time);

        var duration = objectToTime(audios[index].value.to) - objectToTime(audios[index].value.from);

        if (type == "from") {
          audios[index].value.from.mm = timeObject.mm;
          audios[index].value.from.ss = timeObject.ss;
          audios[index].value.from.ss1 = timeObject.ss1;

          var toObj = timeToObject(time + duration);

          audios[index].value.to.mm = toObj.mm;
          audios[index].value.to.ss = toObj.ss;
          audios[index].value.to.ss1 = toObj.ss1;


        }
        else if (type == "to") {
          audios[index].value.to.mm = timeObject.mm;
          audios[index].value.to.ss = timeObject.ss;
          audios[index].value.to.ss1 = timeObject.ss1;

          var fromObj = timeToObject(time - duration + 1);

          audios[index].value.from.mm = fromObj.mm;
          audios[index].value.from.ss = fromObj.ss;
          audios[index].value.from.ss1 = fromObj.ss1;

        }

        var payload = { type: "audios", value: audios };


        this.$store.dispatch("updateToUploadDatas", payload);


      }



      if (this.resizeState == true) {//right

        //check conflict

        if (this.resizeId + 1 != this.width.length) {
          if (this.start[this.resizeId] + this.width[this.resizeId] + e.x - this.resizeStart >= this.start[this.resizeId + 1] && e.x - this.resizeStart > 0) {

            this.start[this.resizeId] = this.start[this.resizeId + 1] - this.width[this.resizeId] - 1;
            update("from", this.start[this.resizeId], this.resizeId);
            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }
        }

        if (this.resizeId != 0) {
          if (this.start[this.resizeId - 1] + this.width[this.resizeId - 1] >= this.start[this.resizeId] + e.x - this.resizeStart) {

            this.start[this.resizeId] = this.start[this.resizeId - 1] + this.width[this.resizeId - 1] + 1;
            update("from", this.start[this.resizeId], this.resizeId);

            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }
        }


        if (this.start[this.resizeId] + e.x - this.resizeStart < 0) {
          this.start[this.resizeId] = 0;

          update("from", this.start[this.resizeId], this.resizeId);

          this.resizeState = false;
          this.resizeStart = 0;
          return;
        }

        this.start[this.resizeId] += e.x - this.resizeStart;
        update("from", this.start[this.resizeId], this.resizeId);

        if (this.resizeId + 1 == this.width.length) {
          var from = parseInt((((this.start[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));
          var to = parseInt((((this.start[this.resizeId] + this.width[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));

          var payload = {
            type: "audioFrom", value: {
              mm: parseInt((from) / (100 * 60)),
              ss: parseInt(((from) % (100 * 60)) / 100),
              ss1: parseInt(((from) % (100 * 60)) % 100),
            }
          };
          this.$store.dispatch("setData", payload);
          update("from", this.start[this.resizeId], this.resizeId);

          payload = {
            type: "audioTo", value: {
              mm: parseInt((to) / (100 * 60)),
              ss: parseInt(((to) % (100 * 60)) / 100),
              ss1: parseInt(((to) % (100 * 60)) % 100),
            }
          };
          this.$store.dispatch("setData", payload);
          update("to", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);
        }



        this.resizeStart = e.x;
      }
    },
    resizeReleased(e) {
      this.resizeState = false;
      this.resizeStart = 0;
    },
  },
};
</script>
<style scoped>
label {
  padding: 10px 0px;
}

.div-range {
  left: 0px;
  height: 28px;
  position: absolute;
  text-indent: 0px;
  background-color: rgb(17, 67, 62);
  margin: 3px 0px;
  border-radius: 5px;
}

.left {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  /* border: none; */
  border-left: solid 2px rgba(255, 255, 255, 0.6);
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 3px;
  width: 6px;
  z-index: 5;
}


.text {
  text-align: center;
  position: relative;
  overflow: hidden;
}


.right {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  /* border: none; */
  /* border-left: solid 2px rgba(255, 255, 255, 0.6); */
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 3px;
  width: 6px;
  z-index: 5;
}


.audio-bar {
  background-color: rgb(20, 20, 20);
  color: #FFFFFF;
  margin-top: 10px;
}

.audio-bar:hover {
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



#context-menu-audio {
  position: fixed;
  z-index: 10000;
  width: 80px;
  background: #1b1a1a;
  border-radius: 5px;
  transform: scale(0);
  transform-origin: top left;
}

#context-menu-audio.visible {
  transform: scale(1);
  transition: transform 200ms ease-in-out;
}

#context-menu-audio.visible {
  display: block;
}

#context-menu-audio .item {
  padding: 5px 5px;
  font-size: 15px;
  color: #eee;
  cursor: pointer;
  border-radius: inherit;
}

.context-menu-audio .item:hover {
  background: #343434;
}
</style>
