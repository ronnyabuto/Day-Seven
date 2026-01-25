export const dynamic = 'force-dynamic'

import { getBookings } from '@/app/actions'
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Smartphone, Calendar, User, FileText, CheckCircle, XCircle } from "lucide-react"

export default async function AdminPage() {
    const bookings = await getBookings()

    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)
    const verifiedBookings = bookings.filter((b: any) => b.metadata?.verified_id).length
    const initiatedPayments = bookings.filter((b: any) => b.metadata?.mpesa_checkout_id).length

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Shield className="w-8 h-8 text-primary" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage bookings, verify IDs, and check M-Pesa payments.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/20 rounded-xl">
                                    <Smartphone className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Est. Revenue</p>
                                    <h3 className="text-2xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Verified Guests</p>
                                    <h3 className="text-2xl font-bold text-foreground">{verifiedBookings} / {bookings.length}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/20 rounded-xl">
                                    <FileText className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Payment Flows</p>
                                    <h3 className="text-2xl font-bold text-foreground">{initiatedPayments}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-0">
                        {bookings.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No bookings found.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/10">
                                {bookings.map((booking: any) => (
                                    <div key={booking.id} className="p-6 hover:bg-white/5 transition-colors">
                                        <div className="flex justify-between items-start gap-6">
                                            {/* Guest Details */}
                                            <div className="space-y-1 min-w-[200px]">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    {booking.guest_name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                    {booking.guest_email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Smartphone className="w-4 h-4" />
                                                    {booking.guest_phone}
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{booking.suite_id}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm font-medium text-emerald-400">
                                                    Total: KES {booking.total_amount?.toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Status Tags */}
                                            <div className="space-y-2 text-right">
                                                <div className="flex items-center justify-end gap-2 text-sm">
                                                    <span>Identity:</span>
                                                    {booking.metadata?.verified_id ? (
                                                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                                            <CheckCircle className="w-3 h-3" /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                                            <XCircle className="w-3 h-3" /> Missing
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-end gap-2 text-sm">
                                                    <span>Payment:</span>
                                                    {booking.metadata?.mpesa_checkout_id ? (
                                                        <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                                                            <Smartphone className="w-3 h-3" /> Initiated
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Pending</span>
                                                    )}
                                                </div>

                                                <div className="text-xs text-muted-foreground font-mono">
                                                    {booking.id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
