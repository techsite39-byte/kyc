import Link from "next/link";
import { Button } from "@/components/ui";

export default function CreateId() {
  return <main className="grid min-h-screen place-items-center"><Link href="/basic-info"><Button className="px-8 py-3">Create ID</Button></Link></main>;
}
