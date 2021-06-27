<template>
  <div class="root">
    <div class="row" v-if="!imgLoaded.value">
      <input type="file" name="img" id="img" accept="image/*" @change="onFileSelect">
    </div>
    <img alt="" ref="imgDisp" style="max-width: 400px;">
    <canvas ref="canvas" v-show="false"/>
    <div class="color-palette">
      <div class="color" v-for="i in 5" :key="i" :id="i - 1" :ref="setColorDivs"></div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue"
import {getPixelsDecimal,decimalToRGB} from "./util/Color";
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

    const colorDivs = [];
    const setColorDivs = (el) => {
      if(el){
        colorDivs[parseInt(el.id)] = el;
      }
    }


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
      let means = kmeans.getKMeans(10);
      means.forEach((m,i) => {
        let rgb = decimalToRGB(Math.trunc(m));
        //console.log(colorDivs);
        colorDivs[i].style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      })
    }


    return {
      canvas,
      imgDisp,
      onFileSelect,
      imgLoaded,
      canvasSize,
      setColorDivs
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

.color-palette{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.color{
  width: 180px;
  height: 100px;
}

</style>
