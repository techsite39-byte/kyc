"use client";

import Link from "next/link";
import { Check } from "lucide-react";
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

function ImageInput({ capture, label, onChange }: { capture?: "environment" | "user"; label?: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="grid min-h-48 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm font-semibold text-brand-600"><span>{label || (capture === "user" ? "Upload Photo" : "Upload Image")}</span><input className="hidden" type="file" accept="image/*" capture={capture} onChange={onChange} /></label>;
}

function imageData(event: ChangeEvent<HTMLInputElement>, update: (images: string[]) => void) {
  const files = Array.from(event.target.files || []).slice(0, 1);
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
  function updateProof(images: string[]) { const next = { ...flow, proofFront: images[0] || flow.proofFront }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">1. Upload Proof</div><div className="grid gap-3"><label className="grid cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold"><span>Scanning</span><input className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => imageData(event, updateProof)} /></label><ImageInput label="Upload front id" onChange={(event) => imageData(event, updateProof)} /></div></section><section className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white p-5">{flow.proofFront && <img src={flow.proofFront} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/upload-back-id"><Button>Upload back id</Button></Link></div></main>;
}

export function UploadBackId() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  function updateProof(images: string[]) { const next = { ...flow, proofBack: images[0] || flow.proofBack }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">Back id</div><div className="grid gap-3"><label className="grid cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold"><span>Scanning</span><input className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => imageData(event, updateProof)} /></label><ImageInput label="Upload back id" onChange={(event) => imageData(event, updateProof)} /></div></section><section className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white p-5">{flow.proofBack && <img src={flow.proofBack} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/selfie"><Button>Next</Button></Link></div></main>;
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
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-5 sm:p-8"><section className="flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_20px_55px_rgba(15,35,65,.08)] sm:px-10 sm:py-12"><div className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/60"><Check className="h-8 w-8" strokeWidth={2.5} /></div><h1 className="mt-7 text-3xl font-bold tracking-tight text-ink">All done</h1><p className="mt-3 text-base font-medium text-slate-500">Verification pending</p><Link href="/create-id" className="mt-9"><Button className="min-w-32 rounded-xl px-7 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">Next</Button></Link></section></main>;
}
