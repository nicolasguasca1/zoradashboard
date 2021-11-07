import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { item } from "./index";
import axios from "axios";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../hardhat/artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const CreatorDahboard: NextPage = () => {
  const [nfts, setNfts] = useState<ethers.Contract[]>([]);
  const [sold, setSold] = useState<ethers.Contract[]>([]);

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNfts();
  }, []);
  async function loadNfts() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarket.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i: item) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: Number(i.tokenId),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image
        };
        return item;
      })
    );

    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems as ethers.Contract[]);
    setNfts(items as ethers.Contract[]);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets created</h1>;
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft: ethers.Contract, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img className="rounded" src={nft.image} />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} ETH
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4">
        {Boolean(sold.length) && (
          <div>
            <h1 className="text-2xl py-2">Items Sold</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {sold.map((nft: ethers.Contract, i) => (
                <div
                  key={i}
                  className="border shadow rounded-xl overflow-hidden"
                >
                  <img className="rounded" src={nft.image} />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">
                      Price - {nft.price} ETH
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDahboard;
