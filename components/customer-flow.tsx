"use client";

import Link from "next/link";
import { Check, Eye, EyeOff } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { emptyCustomerFlow, readCustomerFlow, writeCustomerFlow, type CustomerFlowState } from "@/lib/customer-flow";

export function BasicInformation() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => setFlow(readCustomerFlow()), []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeCustomerFlow(flow);
    window.location.href = "/upload-document";
  }

  return <main className="grid min-h-screen place-items-center p-5"><form onSubmit={submit} className="grid w-full max-w-sm gap-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,35,65,.08)]"><label className="grid gap-2 text-sm font-semibold">Name<input className="field transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required value={flow.name} onChange={(event) => setFlow({ ...flow, name: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold">Year<input className="field transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required inputMode="numeric" value={flow.year} onChange={(event) => setFlow({ ...flow, year: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold">Password<div className="relative"><input className="field pr-11 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required type={showPassword ? "text" : "password"} value={flow.password} onChange={(event) => setFlow({ ...flow, password: event.target.value })} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label><div className="flex items-center justify-between pt-2"><Link href="/upload-document" className="text-sm font-semibold text-brand-600">Skip</Link><Button type="submit">Next</Button></div></form></main>;
}

export function UploadDocument() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  const [documentPreview, setDocumentPreview] = useState<string>("");

  useEffect(() => setFlow(readCustomerFlow()), []);

  function updateDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      setDocumentPreview(value);
      const next = { ...flow, proofFront: value };
      setFlow(next);
      writeCustomerFlow(next);
    };
    reader.readAsDataURL(file);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeCustomerFlow(flow);
    window.location.href = "/upload-proof";
  }

  return <main className="grid min-h-screen place-items-center bg-slate-50 p-5"><form onSubmit={submit} className="grid w-full max-w-xl gap-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,35,65,.08)]"><div className="space-y-2"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">KYC</p><h1 className="text-3xl font-bold tracking-tight text-ink">Upload document</h1></div><label className="grid gap-2 text-sm font-semibold text-slate-700">Name<input className="field transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required value={flow.name} onChange={(event) => setFlow({ ...flow, name: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold text-slate-700">Document file<input className="field cursor-pointer transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" type="file" accept="image/*,.pdf" onChange={updateDocument} /></label>{documentPreview && <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3"><img src={documentPreview} alt="Document preview" className="max-h-72 w-full rounded-xl object-contain" /></div>}<div className="flex items-center justify-between pt-2"><Link href="/upload-proof" className="text-sm font-semibold text-brand-600">Skip</Link><Button type="submit">Generate</Button></div></form></main>;
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
  function updateBack(images: string[]) { const next = { ...flow, proofBack: images[0] || flow.proofBack }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">1. Upload Proof</div><div className="grid gap-3"><label className="grid cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold"><span>Scanning</span><input className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => imageData(event, updateProof)} /></label><ImageInput label="Upload front id" onChange={(event) => imageData(event, updateProof)} /><ImageInput label="Upload back id" onChange={(event) => imageData(event, updateBack)} /></div></section><section className="grid min-h-64 grid-cols-2 place-items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">{flow.proofFront && <img src={flow.proofFront} alt="" className="max-h-80 max-w-full object-contain" />}{flow.proofBack && <img src={flow.proofBack} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/selfie"><Button>Next</Button></Link></div></main>;
}

export function UploadBackId() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  function updateProof(images: string[]) { const next = { ...flow, proofBack: images[0] || flow.proofBack }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">Back id</div><div className="grid gap-3"><label className="grid cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold"><span>Scanning</span><input className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => imageData(event, updateProof)} /></label><ImageInput label="Upload back id" onChange={(event) => imageData(event, updateProof)} /></div></section><section className="grid min-h-64 grid-cols-2 place-items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">{flow.proofFront && <img src={flow.proofFront} alt="" className="max-h-80 max-w-full object-contain" />}{flow.proofBack && <img src={flow.proofBack} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/selfie"><Button>Next</Button></Link></div></main>;
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
