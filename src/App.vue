<template>
  <div class="root">
    <div class="row" v-if="!imgLoaded.value">
      <input type="file" name="img" id="img" accept="image/*" @change="onFileSelect">
    </div>
    <img alt="" ref="imgDisp" style="max-width: 600px;">
    <canvas ref="canvas" v-show="false"/>
  </div>
</template>

<script>
import {ref} from "vue"
import {getPixelsDecimal} from "./util/Color";
import kmeans from "./util/kmeans";

export default {
  name: "App",
  components: {
  },
  setup(props){

    const canvas = ref(null);
    const imgDisp = ref(null);
    const imgLoaded = ref(false);
    const canvasSize = ref(50);

    const onFileSelect = (e) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let img = imgDisp.value;

        img.onload = () => {
          //rescale image and draw it on canvas
          let ratio = canvasSize.value/Math.max(img.width, img.height);
          let w = ratio * img.width;
          let h = ratio * img.height;
          canvas.value.width = w;
          canvas.value.height = h;
          let ctx = canvas.value.getContext('2d');
          ctx.drawImage(img,0,0,w,h);

          genPalette(ctx.getImageData(0,0,w,h));

          imgLoaded.value = true;

        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(e.target.files[0]);
    };

    const genPalette = (imgData) => {
      kmeans.init(getPixelsDecimal(imgData));
      kmeans.runIteration();
    }


    return {
      canvas,
      imgDisp,
      onFileSelect,
      imgLoaded,
      canvasSize
    };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.root{
  width: 900px;
  margin:0 auto;
}

.row{
  width: 100%;
  margin: 30px 0;
}

</style>
