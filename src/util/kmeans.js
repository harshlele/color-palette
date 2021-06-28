const clusters = 5;
const centroids = new Array(clusters).fill();
let pts = [];

function initCentroids(){
    for(let i = 0; i < clusters;i++){
        centroids[i] = pts[Math.floor(Math.random() * pts.length)].val;
    }
}

function init(arr){
    pts = arr;
    initCentroids();
}

function diff(p1,p2){
    return Math.abs(p1-p2);
}

function assignClusters(){
    let reAssign = false;
    for(let j = 0; j < pts.length; j++){
        for(let k = 0; k < clusters; k++){
            if( !pts[j].diff || pts[j].diff > diff(pts[j].val,centroids[k]) ){
                pts[j].diff = diff(pts[j].val,centroids[k]);
                pts[j].centroid = k;
                
                reAssign = true;
            }
        }
    }

    return reAssign;
}

function calcNewMeans(){
    let totals = new Array(clusters).fill(0);
    let clusterSizes = new Array(clusters).fill(0);

    for(let i = 0; i < pts.length; i++){
        let mInd = pts[i].centroid;

        totals[mInd] += pts[i].val;
        clusterSizes[mInd] += 1;
    }

    for(let j = 0; j < clusters; j++){
        centroids[j] = Math.floor(totals[j]/clusterSizes[j]);
        if(isNaN(centroids[j])) centroids[j] = 0;
        
    }
}

function calcNewMedians(){
    let cArr = new Array(clusters);

    for(let i = 0; i < pts.length; i++){
        let mInd = pts[i].centroid;
        if(!cArr[mInd]) cArr[mInd] = [];
        cArr[mInd].push(pts[i].val);
    }

    for (let j = 0; j < clusters; j++){
        cArr[j].sort((a,b) => a - b);
        if(cArr[j].length % 2 == 0){
            centroids[j] = cArr[j][cArr[j].length/2 - 1];
        }
        else{
            centroids[j] = cArr[j][Math.floor(cArr[j].length/2)];
        }
    }
}

function runIteration(max = 100, medians = false){
    if(pts.length == 0) return;
    
    for(let i = 0; i < max; i++){
        let re = assignClusters();
        if(!re){
            break;
        }
        else {
           if(!medians) calcNewMeans();
           else calcNewMedians();
        }
        if(i == max - 1){
            assignClusters();
        }
    }
}

function getKCentroids(max = 100){
    if(pts.length == 0) return;
    
    let minCost = Number.MAX_SAFE_INTEGER;    
    let minVarCentroids = [];
    for(let i = 0; i < max; i++){
        runIteration(10,true);
        let cost = calcCost(true);
        if(cost < minCost){
            minCost = cost;
            minVarCentroids = [];
            minVarCentroids.push(...centroids);
        }
    }

    return minVarCentroids;
}

function calcCost(median = false){
    let tCost = 0;

    for(let i = 0; i < pts.length; i++){
        if(!median) tCost += Math.pow(pts[i].diff, 2);
        else tCost += pts[i].diff;
    }

    return tCost;
}

module.exports = {
    init,
    runIteration,
    calcCost,
    getKCentroids,
    pts,
    centroids
}