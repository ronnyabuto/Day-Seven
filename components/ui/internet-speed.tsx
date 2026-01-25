import { Wifi, CheckCircle, Smartphone, Zap } from "lucide-react"

export function InternetSpeed() {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-green-500/20 rounded-xl">
                        <Wifi className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-foreground font-medium flex items-center gap-2">
                            Verified Speed
                            <CheckCircle className="w-4 h-4 text-green-400 fill-green-400/10" />
                        </h3>
                        <p className="text-xs text-muted-foreground">Tested 25 mins ago</p>
                    </div>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-foreground">114</span>
                    <span className="text-sm text-muted-foreground font-medium">Mbps</span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Fiber connection</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Smartphone className="w-4 h-4 text-blue-400" />
                        <span>Starlink backup</span>
                    </div>
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
                    <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-muted-foreground">Download</span>
                            <span className="text-green-400 font-medium">114 Mbps</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-[95%] rounded-full" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-muted-foreground">Upload</span>
                            <span className="text-blue-400 font-medium">42 Mbps</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[60%] rounded-full" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="text-white font-mono">12ms</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
