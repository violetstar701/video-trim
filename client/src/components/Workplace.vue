<template>
  <button class="save-btn" @click="trim()"><label class="save-btn-label">Save</label><i
      class="fa fa-upload save-btn-icon"></i></button>
  <div :class="`${this.$store.state.set.loader}`"></div>
  <div :class="`${this.$store.state.set.comment}`" :style="`display:${this.$store.state.set.commentDisplay}`">Saving
    file.&nbsp;&nbsp;&nbsp;Wait a moment...
  </div>
  <div class="panel-container-vertical container-fluid work-place" :style="`display:${this.$store.state.set.all}`">
    <div class="panel-container setting-screen-panel">
      <div class="panel-left tool-setting"
        :style="[this.$store.state.set.selectedSettingTool ? 'min-width: 400px; width:400px;' : 'min-width: 75px; width:75px;']">
        <ToolSettingPanel @forceRendering="forceRendering()" />
      </div>
      <ScreenSizeYController @forceRendering="forceRendering()" />
      <!-- <div class="splitter"></div> -->
      <div class="panel-right padding-none">
        <ScreenPanel @forceRendering="forceRendering()" />
      </div>
    </div>
    <!-- <div class="row-fluid">
      <div class="col-md-12">
        <ScreenSizeXController @forceRendering="forceRendering()" />
      </div>
    </div> -->
    <ScreenSizeXController @forceRendering="forceRendering()" />
    <!-- <div class="splitter-horizontal"></div> -->
    <div class="panel-bottom row-fluid">
      <div class="col-md-12">
        <WorkingPanel @forceRendering="forceRendering()" />
      </div>
    </div>
  </div>
</template>

<script>
import ToolSettingPanel from './ToolSettingPanel.vue';
import ScreenPanel from './ScreenPanel.vue';
import WorkingPanel from './WorkingPanel.vue';
import ScreenSizeXController from './ScreenSizeXController.vue';
import ScreenSizeYController from './ScreenSizeYController.vue';
import setStore from '../store/modules/set.module';
import SetModule from '../store/modules/set.module.js'
import axios from 'axios'
import { computed } from 'vue';
import { useStore } from "vuex";
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue';

export default {
  name: 'Workplace',
  components: {
    ToolSettingPanel,
    ScreenPanel,
    ScreenSizeXController,
    ScreenSizeYController,
    WorkingPanel
  },
  data() {
    return {
      width: 0
    };
  },
  mounted() {
  },
  created() {

    var payload = { type: 'windowWidth', value: document.body.offsetWidth };
    this.$store.dispatch('setData', payload);

    payload = { type: 'windowOuterWidth', value: window.outerWidth };
    this.$store.dispatch('setData', payload);


    payload = {
      type: 'cutFrom', value: {
        mm: this.$store.state.set.videoFrom.mm,
        ss: this.$store.state.set.videoFrom.ss,
        ss1: this.$store.state.set.videoFrom.ss1
      }
    };
    this.$store.dispatch('setData', payload);

    payload = {
      type: 'cutTo', value: {
        mm: this.$store.state.set.videoTo.mm,
        ss: this.$store.state.set.videoTo.ss,
        ss1: this.$store.state.set.videoTo.ss1
      }
    };
    this.$store.dispatch('setData', payload);



  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
  },
  methods: {
    func: function () {
      this.width = 3;
      alert(this.width);
    },
    trim: function () {

      var t_start = this.$store.state.set.videoFrom.mm.toString() + ":" + this.$store.state.set.videoFrom.ss.toString();
      var t_end = this.$store.state.set.videoTo.mm.toString() + ":" + this.$store.state.set.videoTo.ss.toString();


      var c_start = this.$store.state.set.cutFrom.mm.toString() + ":" + this.$store.state.set.cutFrom.ss.toString();
      var c_end = this.$store.state.set.cutTo.mm.toString() + ":" + this.$store.state.set.cutTo.ss.toString();

      var tempTitles = [], tempShapes = [], tempAudios = [];

      const timeToString = value => {
        return Math.trunc(value.mm / 60) + ":" + value.mm % 60 + ":" + value.ss;
      }

      for (var text of this.$store.state.upload.texts) {
        tempTitles.push({
          from: timeToString(text.value.textFrom),
          to: timeToString(text.value.textTo),
          text: text.value.textContent
        });
      }

      //type:Redtangle, Circle, LineToDown, LineToUp, Vertical, Horizontal

      for (var shape of this.$store.state.upload.shapes) {
        tempShapes.push({
          from: timeToString(shape.value.shapeFrom),
          to: timeToString(shape.value.shapeTo),
          screenWidth: shape.value.screenWidth,
          screenHeight: shape.value.screenHeight,
          // color: shape.value.shapeColor,
          // borderWidth: shape.value.shapeBorderWidth,
          type: shape.value.shapeContent,
          borderColor: shape.value.shapeBorderColor,
          width: shape.value.shapeOffsetWidth,
          height: shape.value.shapeOffsetHeight,
          top: shape.value.shapeOffsetTop,
          left: shape.value.shapeOffsetLeft,
        });
      }

      console.log(tempShapes, "tempShapes");

      for (var audio of this.$store.state.upload.audios) {
        tempAudios.push({
          from: timeToString(audio.value.from),
          to: timeToString(audio.value.to),
          filename: audio.value.filename
        });
      }



      console.log(tempAudios, "tempAudios");

      if (t_start == c_start && t_end == c_end) {
        c_start = t_start;
        c_end = c_start;
      }


      var data = {
        "trim": {
          "start": t_start,
          "end": t_end,
        },
        "cut": {
          "start": c_start,
          "end": c_end,
        },
        "subtitles": tempTitles,
        "shapes": tempShapes,
        "audios":tempAudios
      };

      console.log(data, 'uploading');



      var data1;
      data1 = { type: 'loader', value: "loader" };
      this.$store.dispatch('setData', data1);

      data1 = { type: 'all', value: "none" };
      this.$store.dispatch('setData', data1);

      data1 = { type: "comment", value: "loading-text" };
      this.$store.dispatch('setData', data1);

      data1 = { type: "commentDisplay", value: "block" };
      this.$store.dispatch('setData', data1);




      var fname = this.$store.state.set.fileName;
      axios.post('/api/save/' + fname, data).then(ret => {


        var payload = { type: "fileName", value: ret.data.filename };
        this.$store.dispatch("setData", payload);

        payload = { type: "fileCount", value: ret.data.filecount };
        this.$store.dispatch("setData", payload);
        var duration = Number(ret.data.duration) * 100;

        payload = {
          type: "duration", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "videoTo", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "videoFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };


        this.$store.dispatch("setData", payload);
        payload = {
          type: "cutTo", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "cutFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "delay", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "to", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };
        this.$store.dispatch("setData", payload);
        payload = {
          type: "curTime", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };
        this.$store.dispatch("setData", payload);


        payload = {
          type: "from", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };
        this.$store.dispatch("setData", payload);

        payload = {
          type: "textFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);

        payload = {
          type: "textTo", value: {
            mm: 0,
            ss: 5,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);

        /*
                if (this.$store.state.set.textTo.ss >= 5) {
                  payload = {
                    type: "textTo", value: {
                      mm: 0,
                      ss: 5,
                      ss1: 0,
                    }
                  };
                }
                else if (this.$store.state.set.textTo.ss == 0) {
                  payload = {
                    type: "textTo", value: {
                      mm: 0,
                      ss: 0,
                      ss1: 0,
                    }
                  }
                }
                else {
                  payload = {
                    type: "textTo", value: {
                      mm: 0,
                      ss: this.$store.state.set.duration.ss,
                      ss1: 0,
                    }
                  };
                }
        
        
                this.$store.dispatch("setData", payload);
*/

        payload = {
          type: "shapeFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);

        payload = {
          type: "shapeTo", value: {
            mm: 0,
            ss: 5,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);

        /*
        if (this.$store.state.set.shapeTo.ss >= 5) {
          payload = {
            type: "shapeTo", value: {
              mm: 0,
              ss: 5,
              ss1: 0,
            }
          };
        }
        else if (this.$store.state.set.shapeTo.ss == 0) {
          payload = {
            type: "shapeTo", value: {
              mm: 0,
              ss: 0,
              ss1: 0,
            }
          }
        }
        else {
          payload = {
            type: "shapeTo", value: {
              mm: 0,
              ss: this.$store.state.set.duration.ss,
              ss1: 0,
            }
          };
        }


        this.$store.dispatch("setData", payload);
*/

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

        this.$store.dispatch("setData",
          {
            type: "audioDuration", value: 0
          });


        payload = { type: 'comment', value: "none" };
        this.$store.dispatch('setData', payload);


        payload = { type: 'loader', value: "none" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'all', value: "block" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'commentDisplay', value: "none" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'texts', value: [] };
        this.$store.dispatch('updateToUploadDatas', payload);

        payload = { type: 'shapes', value: [] };
        this.$store.dispatch('updateToUploadDatas', payload);

        payload = { type: 'audios', value: [] };
        this.$store.dispatch('updateToUploadDatas', payload);

        this.$router.push('/workplace');
      }).catch(function () {
        console.log('FAILURE!!');
      });
    },
    forceRendering: function () {

      var panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 5 + this.$store.state.set.settingBoxWidth + 1);

      if (this.$store.state.set.selectedSettingTool) {
        panelWidth -= 41;
      }


      var panelHeight;
      if (this.$store.state.set.screenHeight / panelWidth < this.$store.state.set.screenRate) {
        panelHeight = this.$store.state.set.screenHeight;
      }
      else {
        panelHeight = panelWidth * this.$store.state.set.screenRate;
      }
      var payload = { type: 'panelHeight', value: panelHeight };
      this.$store.dispatch('setData', payload);

      payload = { type: 'panelWidth', value: panelWidth };
      this.$store.dispatch('setData', payload);

      payload = { type: 'screenYControllerWidth', value: 5 };
      this.$store.dispatch('setData', payload);
    }
  }
}
</script>
<style scoped>
.save-btn {
  position: fixed;
  top: 2px;
  right: 10px;
  margin-left: 20px;
  background: #34eae1;
  border: solid 1px #FFFFFF;
  border-radius: 5px;

}

.save-btn:hover {
  background: rgba(46, 185, 66, 1);
  cursor: pointer;
}

.save-btn-label {
  margin-left: 20px;
  color: black;
  font-weight: bold;
}

.save-btn-icon {
  margin-left: 20px;
  margin-right: 20px;
  color: black;
}


.loader {
  border: 16px solid #f3f3f3;
  /* Light grey */
  border-top: 16px solid #3498db;
  /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: fixed;
  right: 45%;
  top: 300px;

}


.loading-text {
  position: fixed;
  right: 42%;
  top: 450px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }

}
</style>