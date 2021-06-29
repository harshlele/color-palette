<template>
  <div class="root">
    <div class="row" v-if="!imgLoaded.value">
      <input type="file" name="img" id="img" accept="image/*" @change="onFileSelect">
    </div>
    <img alt="" ref="imgDisp" style="max-width: 400px;">
    <canvas ref="canvas" v-show="false"/>
    <div class="color-palette">
      <div class="color" v-for="p,i in paletteColors" :key="i" :id="`p-${i}`"  :style="`background-color: ${p.rgb}; color: ${p.color}`">
        
        <div class="color-code">
          <button class="btn-copy" @click="copyCode($event,p.rgb)">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12pt" height="12pt" viewBox="0 0 12 12" version="1.1">
              <g id="surface1">
              <path :style="`stroke:none;fill-rule:nonzero;fill:${p.color};fill-opacity:1;`" d="M 8 0.5 L 2 0.5 C 1.449219 0.5 1 0.949219 1 1.5 L 1 8.5 L 2 8.5 L 2 1.5 L 8 1.5 Z M 9.5 2.5 L 4 2.5 C 3.449219 2.5 3 2.949219 3 3.5 L 3 10.5 C 3 11.050781 3.449219 11.5 4 11.5 L 9.5 11.5 C 10.050781 11.5 10.5 11.050781 10.5 10.5 L 10.5 3.5 C 10.5 2.949219 10.050781 2.5 9.5 2.5 Z M 9.5 10.5 L 4 10.5 L 4 3.5 L 9.5 3.5 Z M 9.5 10.5 "/>
              </g>
            </svg>
          </button>
          <span id="rgb">
            {{p.rgb}}
          </span>
        </div>


        <div class="color-code" @click="copyCode($event,p.hex)">
          <button class="btn-copy">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12pt" height="12pt" viewBox="0 0 12 12" version="1.1">
              <g id="surface1">
              <path :style="`stroke:none;fill-rule:nonzero;fill:${p.color};fill-opacity:1;`" d="M 8 0.5 L 2 0.5 C 1.449219 0.5 1 0.949219 1 1.5 L 1 8.5 L 2 8.5 L 2 1.5 L 8 1.5 Z M 9.5 2.5 L 4 2.5 C 3.449219 2.5 3 2.949219 3 3.5 L 3 10.5 C 3 11.050781 3.449219 11.5 4 11.5 L 9.5 11.5 C 10.050781 11.5 10.5 11.050781 10.5 10.5 L 10.5 3.5 C 10.5 2.949219 10.050781 2.5 9.5 2.5 Z M 9.5 10.5 L 4 10.5 L 4 3.5 L 9.5 3.5 Z M 9.5 10.5 "/>
              </g>
            </svg>
          </button>
          <span id="hex">
            {{p.hex}}
          </span>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue"
import {getPixelsDecimal,decimalToRGB, rgbToHex, getTextColor} from "./util/Color";
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
    const paletteColors = ref([]);



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
      let colors = kmeans.getKCentroids(10);
      colors.sort((a,b) => a-b);

      let palette = colors.map((m,i) => {
        let rgb = decimalToRGB(Math.trunc(m));
        let rgbStr = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        let txtColor = getTextColor(rgb[0],rgb[1],rgb[2]);
        let hexStr = rgbToHex(rgb[0],rgb[1],rgb[2]);

        return {
          rgb: rgbStr,
          color: txtColor,
          hex: hexStr
        };
      });

      paletteColors.value = [];
      paletteColors.value.push(...palette);

    }

    const copyCode = (e,txt) => {
      navigator.clipboard.writeText(txt).then(() => {}).catch(e => {console.error(e);});
      
    }


    return {
      canvas,
      imgDisp,
      onFileSelect,
      imgLoaded,
      canvasSize,
      paletteColors,
      copyCode
    };
  }
}
</script>

<style lang="scss">
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.btn-copy{
  border: none;
  background-color: transparent;
}

.color-code{
  width: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 0px 20px;

  button:active, button:hover{
    cursor: pointer;
  }
}


</style>

