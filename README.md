# Bitcoin Transaction Ancestry Sets

Build a basic transaction ancestry set calculator.

# Problem Statement

Every bitcoin transaction has inputs and outputs. When a transaction A uses an output of transaction B, B is a direct parent of A.

The transaction ancestry of A are all direct and indirect parents of A.



Write a program that:

Fetches all transactions for a block 680000

Determines the ancestor set for every transaction in the block (all ancestors need to be in the block as well)

Prints the 10 transaction with the largest ancestry sets.



Output format: txid and ancestry set size.

Use the Esplora HTTP API from blockstream to retrieve the data: https://github.com/Blockstream/esplora/blob/master/API.md

Hint: cache the API responses locally to avoid hitting rate limits.


## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/BlockChain-R/my-first-smart-contract.git
   ```
2. Install the dependencies:

   ```sh
    npm install
    ```


## Usage

To run the project

   ```sh
    npm run start
    ```

## Sample Output:

`
{
  'ec82ab90fe0041ecb67904bb9f123507e3acc5645a7fc9b19114150be1d65bdc' => 3,
  '6422defd90f656b222f7f0ec1d92d6a48c9e1d3d8990499d550d3b7524d32379' => 3,
  '98cb355be8c9ce50b25012c3be250a4352459de3d13c7b52fe20c31c1ac0cda8' => 2,
  'ca2988815d1dbbd37a4ee686e8b8054c221926541ffc70294cfbdca68fc89679' => 2,
  '5e490c3b2b33fc01dbd282050687358e45ec7f205ab2f32d6c1ac736229b88ad' => 2,
  'a6b8ee7dd4f9d30eed8cf4843b4de41a92c6041f32f6a54a0f6a2b9b401cb0d4' => 2,
  'ca921c1abf7fa27d1d9988c1f4615c264daf45e454122a3a8824d89b6684280e' => 2,
  'e0146ea0dde326886c531171f7fe8632944c12bbbcd176960dd0538477fc45df' => 2,
  'fe4ab9c860650f9e54a534764f95dc2c30a374c0768313b8d0aa94f469d275c1' => 2,
  'ab8298096f137d37381ad0f6967f352f76c1509b69b20eb4e70fb375dff7717b' => 2
}
`