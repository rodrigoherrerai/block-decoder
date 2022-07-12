import { utils } from "ethers";
import { Address } from "./types";
import { JsonRpcProvider } from "@ethersproject/providers";

export default class Sanitizer {
  static sanitizeUrl(address: string, etherscanKey: string): string {
    return `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${etherscanKey}`;
  }

  static sanitzeCallData(_callData: string): string {
    let callData = "";
    if (_callData.slice(0, 2).toLowerCase() !== "0x") {
      // If calldata does not come in hex format, we will give it a try and add the prefix.
      callData = `0x${_callData}`;
    } else {
      callData = _callData;
    }
    if (callData.length < 10) {
      // Function selector is 4 bytes (8 hex + 0x).
      // If calldata is less than 10 chars, then the data is invalid.
      throw Error("Incorrect calldata length, cannot be less than 4 bytes.");
    }
    return callData;
  }

  static sanitizeAddress(address: Address): Address {
    return utils.getAddress(address);
  }

  static parse(stringifiedJson: string) {
    return JSON.parse(stringifiedJson);
  }

  static getFunctionName(callData: string, abi: any): string {
    let result = "";

    abi.map((e: any) => {
      if (e.type === "function") {
        const inputs = e.inputs;
        const name = e.name;
        let hash = "";

        if (inputs.length === 0) {
          hash = utils.keccak256(utils.toUtf8Bytes(`${name}()`));
        } else {
          let funcParams = "";

          inputs.map((input: any) => {
            funcParams += "," + input.type;
          });
          hash = utils.keccak256(
            utils.toUtf8Bytes(`${name}(${funcParams.slice(1)})`)
          );
        }
        if (
          callData.slice(0, 10).toLowerCase() ===
          hash.slice(0, 10).toLowerCase()
        ) {
          result = name;
        }
      }
    });
    if (result) {
      return result;
    } else {
      throw Error("Could not find the function name.");
    }
  }
}
