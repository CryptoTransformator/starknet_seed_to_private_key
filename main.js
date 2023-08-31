import { ethers } from "ethers";
import { ec, encode } from "starknet";
import { getStarkPair } from "./argentkeyDerivation.js";
import fs from "fs";

const { sanitizeBytes, addHexPrefix } = encode;

export function recoverPrivateKeyFromMnemonic(mnemonic, baseDerivationPath = "m/44'/9004'/0'/0") {
    const ethersWallet = ethers.Wallet.fromMnemonic(mnemonic);
    const index = 0;
    const starkPair = getStarkPair(index, ethersWallet.privateKey, baseDerivationPath);
    const hexPrivateKey = addHexPrefix(sanitizeBytes(starkPair.getPrivate("hex")));
    
    // Convert the hexadecimal private key to decimal
    const decimalPrivateKey = BigInt(hexPrivateKey).toString(10);

    return decimalPrivateKey;
}

const mnemonics = fs.readFileSync("./data/argent_seed", "utf-8").split("\n").filter(line => line.trim() !== "");

const privateKeys = mnemonics.map(mnemonic => recoverPrivateKeyFromMnemonic(mnemonic.trim()));

fs.writeFileSync("./data/argent_privat_key", privateKeys.join("\n"));

console.log("Private keys are written here ./data/argent_privat_key");
