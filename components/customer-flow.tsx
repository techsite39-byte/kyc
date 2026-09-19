"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { emptyCustomerFlow, readCustomerFlow, writeCustomerFlow, type CustomerFlowState } from "@/lib/customer-flow";

export function BasicInformation() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeCustomerFlow(flow);
    window.location.href = "/upload-proof";
  }

  return <main className="grid min-h-screen place-items-center p-5"><form onSubmit={submit} className="grid w-full max-w-sm gap-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,35,65,.08)]"><label className="grid gap-2 text-sm font-semibold">Name<input className="field transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required value={flow.name} onChange={(event) => setFlow({ ...flow, name: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold">Year<input className="field transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" value={flow.year} onChange={(event) => setFlow({ ...flow, year: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold">Email<input className="field transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" type="email" value={flow.email} onChange={(event) => setFlow({ ...flow, email: event.target.value })} /></label><div className="flex items-center justify-between pt-2"><Link href="/upload-proof" className="text-sm font-semibold text-brand-600">Skip</Link><Button type="submit">Submit</Button></div></form></main>;
}

function ImageInput({ capture, multiple, onChange }: { capture?: "environment" | "user"; multiple?: boolean; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="grid min-h-48 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm font-semibold text-brand-600"><span>{capture === "user" ? "Upload Photo" : "Upload Image"}</span><input className="hidden" type="file" accept="image/*" capture={capture} multiple={multiple} onChange={onChange} /></label>;
}

function imageData(event: ChangeEvent<HTMLInputElement>, update: (images: string[]) => void) {
  const files = Array.from(event.target.files || []).slice(0, 2);
  if (!files.length) return;
  Promise.all(files.map((file) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  }))).then(update);
}

export function UploadProof() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  function updateProof(images: string[]) { const next = { ...flow, proofFront: images[0] || flow.proofFront, proofBack: images[1] || flow.proofBack }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">1. Upload Proof</div><div className="grid gap-3"><label className="grid cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold"><span>Scanning</span><input className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => imageData(event, updateProof)} /></label><ImageInput multiple onChange={(event) => imageData(event, updateProof)} /></div></section><section className="grid min-h-64 grid-cols-2 place-items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">{flow.proofFront && <img src={flow.proofFront} alt="" className="max-h-80 max-w-full object-contain" />}{flow.proofBack && <img src={flow.proofBack} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/selfie"><Button>Next</Button></Link></div></main>;
}

function CameraCapture({ onCapture }: { onCapture: (image: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
    setCameraReady(true);
  }

  useEffect(() => {
    startCamera().catch(() => setCameraReady(false));
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL("image/jpeg", 0.9));
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraReady(false);
  }

  return <div className="grid min-h-48 gap-4 rounded-2xl border-2 border-dashed border-slate-300 p-4"><video ref={videoRef} autoPlay muted playsInline className={`min-h-40 w-full rounded-xl object-cover ${cameraReady ? "" : "hidden"}`} /><Button type="button" onClick={cameraReady ? takePhoto : () => startCamera().catch(() => setCameraReady(false))}>{cameraReady ? "Take Photo" : "Start Camera"}</Button></div>;
}

export function Selfie() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  function updateSelfie(image: string) { const next = { ...flow, selfieImage: image }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">2. Selfie</div><CameraCapture onCapture={updateSelfie} /></section><section className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white p-5">{flow.selfieImage && <img src={flow.selfieImage} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/result"><Button>Next</Button></Link></div></main>;
}

export function Result() {
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center p-5 sm:p-10"><section className="grid min-h-64 w-full max-w-xl flex-1 place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-center"><div><div className="text-2xl font-semibold text-ink">All done</div><div className="mt-3 text-lg text-brand-600">Verification pending</div></div></section><div className="mt-8 flex w-full max-w-5xl justify-end"><Link href="/create-id"><Button>Next</Button></Link></div></main>;
}
