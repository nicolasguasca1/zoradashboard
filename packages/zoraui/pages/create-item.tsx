import { useState, useEffect } from "react";
import { create as ipfsHttpClient, urlSource } from "ipfs-http-client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { item } from "./index";

const client = ipfsHttpClient({
  host: "ipfs.infura.io/api/v0",
  port: 5001,
  protocol: "https"
});

// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../hardhat/artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const CreateItem: () => void = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: ""
  });
  const router = useRouter();

  async function onChange(e: { target: { files: any[] } }) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`)
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (err) {
      console.error(err);
    }
  }

  async function createItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      alert("Please fill in all fields");
      return;
    }
    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (err) {
      console.error("Error uploading file: ", err);
    }
  }

  async function createSale(url: string): Promise<void> {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(
      url
      //  {gasLimit: 1000000}
    );
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString(0);

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice
    });
    await transaction.wait();
    console.log(tx);
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      holii
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Matic"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={() => createSale}
        />
        <button
          onClick={() => createSale}
          className="font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
      ;
    </div>
  );
};
export default CreateItem;
