import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div className="grid min-h-dvh place-items-center bg-[#0b101e] p-6 text-center text-slate-300">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Algo salió mal</h1>
                        <p className="mt-2 text-xs text-slate-400">La vista no pudo cargarse. Puedes recargar la página.</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500"
                        >
                            Recargar
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
