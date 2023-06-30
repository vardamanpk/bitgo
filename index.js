import fetch from 'node-fetch'
const BLOCK_HEIGHT = 680000
const BASE_URL = 'https://blockstream.info/api/'
let blockHash, txnsCount;

const txnAndInputsMap = new Map()
const txnAndAncestryCountMap = new Map()

function getAncestryCount(inputs, txid, set) {
    const stack = [];
    if(txnAndAncestryCountMap[txid]) {
        return txnAndAncestryCountMap[txid];
    }
    if(!inputs)
        return 0;
    for(let i=0;i<inputs.length;i++) {
        const input = inputs[i];
        if(txnAndInputsMap.has(input)){
            /*
            A: [B, C],
            C: [B]
            A ancestry count should be 2, so using set here.
            */
            set.add(input)
            stack.push(input)
        }
    }
    while(stack.length>0) {
        const txnId = stack.pop();
        getAncestryCount(txnAndInputsMap[txnId], txnId, set)
    }
    console.log(`${txid}:${set.size}`)
    txnAndAncestryCountMap.set(txid, set.size)
    return set.size;

}
function buildtxnAndAncestryCountMap() {
    txnAndInputsMap.forEach((inputs, txid) => {
        txnAndAncestryCountMap.set( txid, getAncestryCount(inputs, txid, new Set()) )
    }) 
}

async function buildTxnAndInputsMap(blockHash, txnsCount) {
    let startIndex = 0;
    console.log(`txnsCount:${txnsCount}`)
    while(startIndex<txnsCount) {
        const response = await fetch(`${BASE_URL}/block/${blockHash}/txs/${startIndex}`)
        const data = await response.json()
        for(let i=0; i<data.length; i++) {
            const inputs = data[i].vin;
            const inputTxns = inputs.map((input) => input.txid)
            txnAndInputsMap.set(data[i].txid, inputTxns)
        }
        console.log(startIndex, ':', data.length)
        startIndex += data.length;
    }
    //console.log(txnAndInputsMap)
}
async function getBlockHashFromHeight(height) {
    const response = await fetch(`${BASE_URL}/block-height/${height}`)
    return await response.text()
}

async function getNumberOfTxnsInBlock(blockHash) {
    const response = await fetch(`${BASE_URL}/block/${blockHash}`)
    const data = await response.json()
    return data.tx_count
}

function getTopNTxnsWithLargestAncestrySet(txnAndAncestryCountMap, N = 10) {
    const sortedTxns = new Map([...txnAndAncestryCountMap.entries()].sort((a, b) => b[1] - a[1]));
    return new Map(Array.from(sortedTxns).slice(0, N))
}

async function printTransactionsWithLargeAncestrySet() {
    try {
        blockHash = await getBlockHashFromHeight(BLOCK_HEIGHT)
        txnsCount = await getNumberOfTxnsInBlock(blockHash)
        await buildTxnAndInputsMap(blockHash, txnsCount)
        buildtxnAndAncestryCountMap()
        console.log(blockHash)
        console.log(txnsCount)
        console.log('output:', txnAndAncestryCountMap)
        console.log(getTopNTxnsWithLargestAncestrySet(txnAndAncestryCountMap, 10))
        console.log('Hello')
    }
    catch(error) {
        console.log(error)
    }

}


printTransactionsWithLargeAncestrySet()