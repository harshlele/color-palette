const means = new Array(5);
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
    let sizes = new Array(5).fill(0);

    for(let i = 0; i < pts.length; i++){
        let mInd = pts[i].mean;

        totals[mInd] += pts[i].val;
        sizes[mInd] += 1;
    }

    for(let j = 0; j < 5; j++){
        means[j] = totals[j]/sizes[j];
    }
}


function runIteration(max = 100){
    if(pts.size == 0) return;
    
    for(let i = 0; i < max; i++){
        let re = assignClusters();
        if(!re){
            break;
        }
        else calcNewMeans();
    }

    
}

module.exports = {
    init,
    runIteration,
    pts,
    means
}