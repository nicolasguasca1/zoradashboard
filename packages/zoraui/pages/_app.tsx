import "../styles/globals.css";
import type { AppProps } from "next/app";

import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NF-Times Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-6 text-purple-500">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-purple-500">Sell Digital Asset</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-purple-500">My Digital Asset</a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-purple-500">Creator Dashboard</a>
          </Link>
          <Link href="/gallery">
            <a className="mr-6 text-purple-500">Gallery</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
