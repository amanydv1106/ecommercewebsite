import StoreLayout from "@/components/store/StoreLayout";
import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

export const metadata = {
    title: "NexKart. - Store Dashboard",
    description: "NexKart. - Store Dashboard",
};

export default async function RootAdminLayout({ children }) {
    const { userId } = await auth()

    if (userId) {
        return (
            <StoreLayout>
                {children}
            </StoreLayout>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <SignIn fallbackRedirectUrl="/store" routing="hash" />
        </div>
    );
}
