import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="p-4 normal-case text-xl">
          <Image src="/tangram_logo.png" alt="logo" width={100} height={60} />
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className="font-bold mr-10">
              My Profile
            </Link>
          </li>
          <li>
            <Link href="/" className="btn bg-black font-bold text-white mr-5">
              Log Out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
