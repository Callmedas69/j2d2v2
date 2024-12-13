import TranslateComponent from "@/components/TranslateComponent";
import { projectLinks } from "@/components/link";
import Link from "next/link";
import localFont from "next/font/local";
import j2d2 from "@/assets/J2D2.svg";
import Image from "next/image";

const nounTown = localFont({
  src: "../app/fonts/nountown.otf",
  variable: "--font-noun-town",
  weight: "100 900",
});

export default function Home() {
  return (
    <main>
      {/* TITLE */}
      <h1 className="text-5xl py-10">J2D2</h1>

      {/* MAIN */}
      <div className="flex flex-col md:flex-row">
        {/* IMAGE */}
        <div id="j2d2" className="flex items-end">
          <Image src={j2d2} alt="j2d2" width={500} height={500} />
        </div>

        {/* TRANSLATOR */}
        <div id="translator">
          <TranslateComponent />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="divider">
        <p className={`${nounTown.className}`}>welcome to J2D2 world</p>
        <p className="text-xs italic">welcome to J2D2 world</p>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-col items-center gap-1 md:flex-row">
        {projectLinks.map((projectAddress, index) => (
          <div key={index}>
            <Link href={projectAddress.links}>{projectAddress.title}</Link>
          </div>
        ))}
      </footer>
      <footer className="pt-3 text-xs opacity-50 items-center">
        <p>$J2D2: 0x00ddE4d2F08497bcEC6F5E0666F63e14B3a1Dab9</p>
        <p>2024 CC0 PROJECT</p>
      </footer>
    </main>
  );
}
