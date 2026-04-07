"use client";

import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const { settings, updateSettings } = useApp();
    const { setTheme, theme } = useTheme();

    const handleToggle = (key: keyof typeof settings) => {
        // Special case for boolean settings
        if (typeof settings[key] === 'boolean') {
            updateSettings({ [key]: !settings[key] });
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
                <p className="text-muted-foreground">Manage your application preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configure how you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                                <span>Email Notifications</span>
                                <span className="font-normal text-muted-foreground">Receive emails about new leads.</span>
                            </Label>
                            <Switch
                                id="email-notifications"
                                checked={settings.emailNotifications}
                                onCheckedChange={() => handleToggle('emailNotifications')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
                                <span>SMS Notifications</span>
                                <span className="font-normal text-muted-foreground">Receive text messages for urgent alerts.</span>
                            </Label>
                            <Switch
                                id="sms-notifications"
                                checked={settings.smsNotifications}
                                onCheckedChange={() => handleToggle('smsNotifications')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                                <span>Marketing Emails</span>
                                <span className="font-normal text-muted-foreground">Receive product updates and offers.</span>
                            </Label>
                            <Switch
                                id="marketing-emails"
                                checked={settings.marketingEmails}
                                onCheckedChange={() => handleToggle('marketingEmails')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                                <span>Dark Mode</span>
                                <span className="font-normal text-muted-foreground">Toggle between light and dark themes.</span>
                            </Label>
                            <Switch
                                id="dark-mode"
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>API Configuration</CardTitle>
                        <CardDescription>Manage your API keys for third-party integrations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="api-key"
                                    value={settings.apiKey}
                                    readOnly
                                    className="font-mono bg-muted"
                                />
                                <Button variant="secondary" onClick={() => {/* Copy logic */ }}>Copy</Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Do not share your API key with others.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
