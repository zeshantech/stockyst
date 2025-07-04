"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div className="clerk-profile">
        <UserProfile />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Connect your accounts to enable single sign-on and enhance your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Google</div>
                <div className="text-sm text-muted-foreground">Connect your Google account to enable single sign-on</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" fill="#1877F2" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Facebook</div>
                <div className="text-sm text-muted-foreground">Connect your Facebook account to enhance your profile</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.9441 7.92638C19.9568 8.10403 19.9568 8.28173 19.9568 8.45938C19.9568 14 15.8325 20.2907 8.29441 20.2907C5.97207 20.2907 3.81473 19.5345 2 18.2283C2.32996 18.2695 2.64719 18.2831 2.98987 18.2831C4.90607 18.2831 6.67004 17.5545 8.07867 16.3211C6.27664 16.28 4.76648 15.0874 4.24719 13.4386C4.5 13.4798 4.75276 13.5074 5.01825 13.5074C5.38903 13.5074 5.75985 13.4523 6.1051 13.3557C4.2335 12.9736 2.84766 11.3108 2.84766 9.31569V9.26099C3.39324 9.56563 4.01521 9.75604 4.67004 9.7835C3.58139 9.04106 2.87359 7.79689 2.87359 6.39396C2.87359 5.62462 3.07385 4.91907 3.42162 4.30969C5.41369 6.78241 8.44949 8.3899 11.8477 8.57335C11.7827 8.26871 11.745 7.95111 11.745 7.63347C11.745 5.37497 13.5722 3.5416 15.8451 3.5416C17.0233 3.5416 18.0868 4.04968 18.84 4.85589C19.7664 4.6655 20.6547 4.30969 21.4477 3.82453C21.143 4.81984 20.4855 5.6246 19.6223 6.1327C20.4602 6.03331 21.2659 5.78755 22 5.45697C21.4477 6.27592 20.7526 7.00435 19.9441 7.92638Z"
                    fill="#1DA1F2"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">Twitter</div>
                <div className="text-sm text-muted-foreground">Connect your Twitter account to share updates</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
