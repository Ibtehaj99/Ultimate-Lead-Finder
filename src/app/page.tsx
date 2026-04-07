"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Globe, Search, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden relative transition-colors duration-300">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 dark:bg-purple-900/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 dark:bg-indigo-900/40 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <section className="relative w-full max-w-7xl px-6 py-24 md:py-32 flex flex-col items-center text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-xl mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                        The Ultimate Lead Generation Tool
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                        Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Hidden Leads</span> <br />
                        Before Your Competitors
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Instantly discover businesses on Google, Facebook, Instagram, and more.
                        Identify outdated websites and open the door to your next big client.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard/search">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-lg rounded-full">
                                Start Finding Leads <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary h-12 text-lg rounded-full bg-background/50 backdrop-blur-sm">
                            Watch Demo
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="relative w-full max-w-7xl px-6 py-20 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Search className="h-10 w-10 text-indigo-500" />}
                        title="Multi-Platform Search"
                        description="Scrape leads from Google Maps, Facebook, Instagram, LinkedIn, and TikTok in seconds."
                    />
                    <FeatureCard
                        icon={<Globe className="h-10 w-10 text-purple-500" />}
                        title="Website Audit AI"
                        description="Automatically detect businesses with no website or outdated sites (pre-2020) that need a revamp."
                    />
                    <FeatureCard
                        icon={<Zap className="h-10 w-10 text-pink-500" />}
                        title="Instant Contact Info"
                        description="Get emails, phone numbers, and social profiles directly. No more manual hunting."
                    />
                </div>
            </section>

            {/* Membership/Pricing */}
            <section className="relative w-full max-w-7xl px-6 py-20 z-10 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 text-center">Simple Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <PricingCard title="Starter" price="$49" features={["500 Leads/mo", "Google & Facebook", "Basic Email Support"]} />
                    <PricingCard title="Pro" price="$99" featured features={["Unlimited Leads", "All Platforms", "Website Audit AI", "Priority Support"]} />
                    <PricingCard title="Agency" price="$299" features={["Team Access", "API Access", "White Label Reports", "Dedicated Manager"]} />
                </div>
            </section>

            <footer className="w-full border-t border-border py-10 text-center text-muted-foreground z-10 bg-background">
                <p>© 2024 Ultimate Lead Finder. All rights reserved.</p>
            </footer>
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300">
            <CardHeader>
                <div className="mb-4">{icon}</div>
                <CardTitle className="text-xl text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-muted-foreground text-base">{description}</CardDescription>
            </CardContent>
        </Card>
    )
}

function PricingCard({ title, price, features, featured }: { title: string, price: string, features: string[], featured?: boolean }) {
    return (
        <Card className={cn(
            "border-border bg-card/50 backdrop-blur-sm relative overflow-hidden",
            featured ? "border-indigo-500 ring-1 ring-indigo-500/50 scale-105 shadow-2xl shadow-indigo-500/20" : "hover:border-primary/50"
        )}>
            {featured && <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">RECOMMENDED</div>}
            <CardHeader>
                <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
                <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{price}</span>
                    <span className="text-muted-foreground">/month</span>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                        </li>
                    ))}
                </ul>
                <Button className={cn("w-full mt-8", featured ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-secondary hover:bg-secondary/80 text-secondary-foreground")}>
                    Get Started
                </Button>
            </CardContent>
        </Card>
    )
}
