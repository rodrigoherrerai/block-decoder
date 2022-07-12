import Sanitizer from "./Sanitizer";
import { ethers, utils } from "ethers";
import axios from "axios";
import { DecodedOutput, Address } from "./types";

export default class BlockDecoder {
  etherscanKey: string;

  constructor(_etherscanKey?: string) {
    this.etherscanKey = _etherscanKey
      ? _etherscanKey
      : "9Y8MK56IN3576TEDFCY6FWIVHHUI24B6KB";
  }

  async getAbi(_address: string): Promise<string> {
    const address = Sanitizer.sanitizeAddress(_address);
    const requestUrl = Sanitizer.sanitizeUrl(address, this.etherscanKey);
    try {
      const response = await axios.get(requestUrl);
      if (response.data.result === "Contract source code not verified") {
        throw Error("Contract source code not verified");
      }
      return response.data.result;
    } catch (e) {
      throw Error(`Error fetching abi: ${e}`);
    }
  }

  getFunctionName(_callData: string, _abi: string): DecodedOutput {
    const abi = Sanitizer.parse(_abi);
    const callData = Sanitizer.sanitzeCallData(_callData);
    const functionName = Sanitizer.getFunctionName(callData, abi);
    return {
      functionName: functionName,
    };
  }

  async decodeData(callData: string, address: Address): Promise<DecodedOutput> {
    const abi = await this.getAbi(address);
    const functionName = this.getFunctionName(callData, abi);
    return functionName;
  }
}
