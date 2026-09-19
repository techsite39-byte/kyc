import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return <main className="grid min-h-screen place-items-center"><Link href="/create-id"><Button className="px-8 py-3">Create ID</Button></Link></main>;
}
