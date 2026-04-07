"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    const { user, updateUser } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    // Local state for form to handle input before save
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateUser(formData);
            setIsLoading(false);
            // Optionally add toast here
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Profile</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_250px] md:items-start">
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" className="w-full">
                                Change Avatar
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>You are currently on the <span className="font-bold text-primary">{user.plan}</span> plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full">Upgrade Plan</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
