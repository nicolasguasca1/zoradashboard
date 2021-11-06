import "ipfs-http-client";
import { ClientOptions } from "ipfs-http-client/src/lib/core";
import Multiaddr from "multiaddr";

declare module "ipfs-http-client" {
  export as namespace ipfsClient;
  export interface ipfsClientReturn {
    cat: (
      cid: string,
      options: ClientOptions | URL | Multiaddr | string
    ) => AsyncIterable<Uint8Array>;
  }
}
