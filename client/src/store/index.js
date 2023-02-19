import { createStore } from 'vuex'
import SetModule from './modules/set.module.js'
import UploadModule from './modules/upload.module.js'


export default createStore({
  modules: {
    set: SetModule,
    upload: UploadModule
  }
});



