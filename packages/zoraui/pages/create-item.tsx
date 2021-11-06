import { useState, useEffect } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config";
