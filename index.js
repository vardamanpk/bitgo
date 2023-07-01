import fetch from 'node-fetch'
const BLOCK_HEIGHT = 680000
const BASE_URL = 'https://blockstream.info/api/'
let blockHash, txnsCount;

const txnAndInputsMap = new Map()
const txnAndAncestryMap = new Map()

function buildAncestryForTxn(txid) {
    function dfs(txnId) {
        if(!txnAndAncestryMap.has(txid))
            txnAndAncestryMap.set(txid, new Set())
        const inputs = txnAndInputsMap.get(txnId) || [];
        for(let i=0;i<inputs.length;i++) {
            const input = inputs[i];
            if(txnAndInputsMap.has(input)) {
                txnAndAncestryMap.get(txid).add(input)
            }
            dfs(input);
        }
    }
    dfs(txid);
}
function buildtxnAndAncestryCountMap() {
    txnAndInputsMap.forEach((inputs, txid) => {
        buildAncestryForTxn(txid)
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

function getTopNTxnsWithLargestAncestrySet(txnAndAncestryMap, N = 10) {
    const sortedTxns = new Map([...txnAndAncestryMap.entries()].sort((a, b) => b[1].size - a[1].size));
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
        const output = getTopNTxnsWithLargestAncestrySet(txnAndAncestryMap, 10)
        console.log('Output:')
        for(let [txnId, ancestors] of  output) {
            console.log(`${txnId} => ${ancestors.size}`)
        }
    }
    catch(error) {
        console.log(error)
    }

}


printTransactionsWithLargeAncestrySet()