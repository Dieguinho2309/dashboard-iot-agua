import { useEffect, useRef, useState } from "react";
import AppLayout from "../components/AppLayout";
import Panel from "../components/Panel";
import { SendIcon, SparkIcon } from "../components/Icons";
import { initialMessages, projectionReply, quickPrompts } from "../data/aiProjection";
import { sensorConfig } from "../data/sensors";
import { usePageMeta } from "../hooks/usePageMeta";
import { useReadings } from "../hooks/useReadings";
import { isMock } from "../lib/api";

const keys = Object.keys(sensorConfig);

function ChatMessage({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && (
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-500/15 text-cyan-300">
                    <SparkIcon className="size-4" />
                </span>
            )}

            <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isUser
                        ? "bg-cyan-500 text-slate-950"
                        : "border border-slate-800 bg-slate-950/60 text-slate-200"
                }`}
            >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {!isUser && (
                    <span className="mt-1.5 block text-[10px] font-semibold tracking-wide text-amber-300/80 uppercase">
                        Ejemplo de proyección
                    </span>
                )}
            </div>
        </div>
    );
}

export default function AIChatPage() {
    const readings = useReadings();
    const headingRef = usePageMeta("Asistente IA");
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const nextId = useRef(1);
    const timerRef = useRef(null);
    const endRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, thinking]);

    function sendMessage(raw) {
        const text = raw.trim();
        if (!text || thinking) return;

        const userId = `u-${nextId.current++}`;
        setMessages((previous) => [...previous, { id: userId, role: "user", text }]);
        setInput("");
        setThinking(true);

        timerRef.current = setTimeout(() => {
            const assistantId = `a-${nextId.current++}`;
            setMessages((previous) => [
                ...previous,
                { id: assistantId, role: "assistant", text: projectionReply(text) }
            ]);
            setThinking(false);
            timerRef.current = null;
        }, 700);
    }

    function handleSubmit(event) {
        event.preventDefault();
        sendMessage(input);
    }

    return (
        <AppLayout readings={readings}>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-white">
                        Asistente IA
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Vista previa de la interfaz · sin modelo conectado
                    </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300">
                    <SparkIcon className="size-3.5" />
                    Proyección
                </span>
            </div>

            <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
                <strong className="font-semibold">Esto no es una IA funcionando.</strong> Es una proyección de la
                experiencia. Las respuestas son ejemplos y no analizan lecturas reales.
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/15 text-cyan-300">
                                <SparkIcon className="size-4" />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Asistente AquaMagdalena</h3>
                                <p className="text-[11px] text-slate-400">Ejemplos basados en el contexto del proyecto</p>
                            </div>
                        </div>
                        <span className="hidden rounded-full border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:inline">
                            Sin modelo
                        </span>
                    </div>

                    <div role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto p-4">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {thinking && (
                            <div className="flex gap-2">
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-500/15 text-cyan-300">
                                    <SparkIcon className="size-4" />
                                </span>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5">
                                    <span role="status" className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                        <span className="size-1.5 animate-pulse rounded-full bg-cyan-400 motion-reduce:animate-none" />
                                        Preparando ejemplo...
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={endRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="border-t border-slate-800 p-3">
                        <label htmlFor="ai-chat-input" className="sr-only">
                            Escribe tu pregunta
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="ai-chat-input"
                                type="text"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder="Pregunta sobre pH, temperatura o conductividad..."
                                disabled={thinking}
                                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || thinking}
                                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <SendIcon className="size-4" />
                                <span className="hidden sm:inline">Enviar</span>
                            </button>
                        </div>
                        <p className="mt-2 text-[10px] text-slate-500">
                            Proyección: las respuestas son ilustrativas y no reemplazan una medición real.
                        </p>
                    </form>
                </section>

                <div className="space-y-4">
                    <Panel>
                        <h3 className="text-sm font-semibold text-white">Sugerencias</h3>
                        <div className="mt-3 space-y-2">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => sendMessage(prompt)}
                                    disabled={thinking}
                                    className="w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-left text-[11px] text-slate-300 transition hover:border-cyan-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </Panel>

                    <Panel>
                        <h3 className="text-sm font-semibold text-white">Contexto que usará</h3>
                        <p className="mt-1 text-[11px] text-slate-400">
                            {isMock ? "Lecturas simuladas de referencia" : "Últimas lecturas del nodo"}
                        </p>
                        <dl className="mt-3 space-y-2 text-xs">
                            {keys.map((key) => {
                                const sensor = sensorConfig[key];
                                const value = readings.values[key];
                                return (
                                    <div key={key} className="flex items-center justify-between gap-3">
                                        <dt className="text-slate-400">{sensor.title}</dt>
                                        <dd className="font-mono text-white tabular-nums">
                                            {value == null ? "—" : Number(value).toFixed(sensor.decimals)}
                                            {sensor.unit ? ` ${sensor.unit}` : ""}
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </Panel>

                    <Panel>
                        <h3 className="text-sm font-semibold text-white">Estado de la implementación</h3>
                        <ul className="mt-3 space-y-2 text-[11px]">
                            <li className="flex items-center justify-between gap-3">
                                <span className="text-slate-400">Interfaz de conversación</span>
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-300">
                                    Lista
                                </span>
                            </li>
                            <li className="flex items-center justify-between gap-3">
                                <span className="text-slate-400">Conexión con /api/chat</span>
                                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-300">
                                    Pendiente
                                </span>
                            </li>
                            <li className="flex items-center justify-between gap-3">
                                <span className="text-slate-400">Modelo Ollama + lecturas</span>
                                <span className="rounded-full bg-slate-700/40 px-2 py-0.5 font-semibold text-slate-400">
                                    Pendiente
                                </span>
                            </li>
                        </ul>
                    </Panel>
                </div>
            </div>
        </AppLayout>
    );
}
