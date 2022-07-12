# block-decoder

## WHAT
#### Decodes calldata bytestrings for better signature visibility

## Example: 

```ts 
import BlockDecoder from "../BlockDecoder";

async function decode(): Promise<void> {
  const addr = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"; // crypto punks address.

  // Complete transaction calldata.
  const callData =
    "0x8264fe980000000000000000000000000000000000000000000000000000000000001538";

  const decoder = new BlockDecoder();

  const result = await decoder.decodeData(callData, addr);
  console.log(result);
}

```


### Output:

```js

{ functionName: 'buyPunk' }

```
