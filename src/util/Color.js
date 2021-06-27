module.exports = {
    getPixelsDecimal(cImgData){
        let decimalPixels = [];
        let w = cImgData.width;
        let h = cImgData.height;
        let data = cImgData.data;
        for(let i = 0; i < w; i++){
            for(let j = 0; j < h; j++){
                let red = (j * (w * 4)) + (i * 4);
                
                //convert rgb to decimal
                let decimal = data[red] * 65536 + data[red + 1] * 256 + data[red + 2];
                
                decimalPixels.push({
                    val: decimal
                });
            }
        }
        return decimalPixels;
    },

    decimalToRGB(c){
        var r = Math.floor(c / (256*256));
        var g = Math.floor(c / 256) % 256;
        var b = c % 256;

        return [r,g,b];
    }
}