import { useState, useEffect } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import type { NextPage } from "next";
import { createClient } from "urql";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../../hardhat/artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../hardhat/artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export type item = {
  tokenId: { toString: () => any };
  price: { toString: () => any };
  seller: any;
  owner: any;
};

const Home: NextPage = (props) => {
  const [nfts, setNfts]: any[] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/Dlvf3vPIZ233aFWBsbNeBosPO703tYXR"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarket.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items: unknown[] = await Promise.all(
      data.map(async (i: item) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: Number(i.tokenId),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft: item) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftmarketaddress,
      NFTMarket.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft: any, i: any) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl fron-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} Matic
                </p>
                <button
                  type="button"
                  className="w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy{" "}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
