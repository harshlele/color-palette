const clusters = 5;
const means = new Array(clusters).fill();
let pts = [];

function initMeans(){
    for(let i = 0; i < clusters;i++){
        means[i] = pts[Math.floor(Math.random() * pts.length)].val;
    }
}

function init(arr){
    pts = arr;
    initMeans();
}

function diff(p1,p2){
    return Math.abs(p1-p2);
}

function assignClusters(){
    let reAssign = false;
    for(let j = 0; j < pts.length; j++){
        for(let k = 0; k < clusters; k++){
            if( !pts[j].diff || pts[j].diff > diff(pts[j].val,means[k]) ){
                pts[j].diff = diff(pts[j].val,means[k]);
                pts[j].mean = k;
                
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
        let mInd = pts[i].mean;

        totals[mInd] += pts[i].val;
        clusterSizes[mInd] += 1;
    }

    for(let j = 0; j < clusters; j++){
        means[j] = Math.floor(totals[j]/clusterSizes[j]);
        if(isNaN(means[j])) means[j] = 0;
        
    }
}


function runIteration(max = 100){
    if(pts.length == 0) return;
    
    for(let i = 0; i < max; i++){
        let re = assignClusters();
        if(!re){
            break;
        }
        else calcNewMeans();
        if(i == max - 1){
            assignClusters();
        }
    }
}

function getKMeans(max = 100){
    if(pts.length == 0) return;
    
    let minCost = Number.MAX_SAFE_INTEGER;    
    let minVarMeans = [];
    for(let i = 0; i < max; i++){
        runIteration();
        let cost = calcCost();
        if(cost < minCost){
            minCost = cost;
            minVarMeans = [];
            minVarMeans.push(...means);
        }
    }

    return minVarMeans;
}

function calcCost(){
    let tCost = 0;
    let cost = new Array(clusters).fill(0);

    for(let i = 0; i < pts.length; i++){
        let mInd = pts[i].mean;
        cost[mInd] += Math.pow(pts[i].diff, 2);
    }

    for(let j = 0; j < clusters; j++){
        tCost += cost[j];
    }

    return tCost;
}

module.exports = {
    init,
    runIteration,
    calcCost,
    getKMeans,
    pts,
    means
}