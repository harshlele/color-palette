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
    },

    rgbToHex(r,g,b){
        return "#"
                + r.toString(16).padStart(2,"0").toUpperCase()
                + g.toString(16).padStart(2,"0").toUpperCase()
                + b.toString(16).padStart(2,"0").toUpperCase();
    },

    getTextColor(r,g,b){
        let hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
            );

        if (hsp>127.5) {
            return "black";
        } 
        else {
    
            return "white";
        }
    }
}