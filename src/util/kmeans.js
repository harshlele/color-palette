const means = new Array(5).fill();
let pts = [];

function initMeans(){
    for(let i = 0; i < 5;i++){
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
        for(let k = 0; k < 5; k++){
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
    let totals = new Array(5).fill(0);
    let clusterSizes = new Array(5).fill(0);

    for(let i = 0; i < pts.length; i++){
        let mInd = pts[i].mean;

        totals[mInd] += pts[i].val;
        clusterSizes[mInd] += 1;
    }

    for(let j = 0; j < 5; j++){
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
    
    let minVarSum = Number.MAX_SAFE_INTEGER;    
    let minVarMeans = [];
    for(let i = 0; i < max; i++){
        runIteration();
        let currVar = calcVarianceSum();
        if(currVar < minVarSum){
            minVarSum = currVar;
            minVarMeans = [];
            minVarMeans.push(...means);
        }
    }

    return minVarMeans;
}

function calcVarianceSum(){
    let varSum = 0;
    let diffSqTotals = new Array(5).fill(0);
    let clusterSizes = new Array(5).fill(0);

    for(let i = 0; i < pts.length; i++){
        let mInd = pts[i].mean;

        diffSqTotals[mInd] += Math.pow(pts[i].diff, 2);
        clusterSizes[mInd] += 1;
    }

    for(let j = 0; j < 5; j++){
        let variance = diffSqTotals[j]/clusterSizes[j];
        if(isNaN(variance)) variance = 0; 
        varSum += variance;
    }

    return varSum;
}

module.exports = {
    init,
    runIteration,
    calcVarianceSum,
    getKMeans,
    pts,
    means
}