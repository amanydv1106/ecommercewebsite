import AdminLayout from "@/components/admin/AdminLayout";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
    title: "NexKart. - Admin",
    description: "NexKart. - Admin",
};

export default async function RootAdminLayout({ children }) {
    const { userId } = await auth()

    if (userId) {
        return (
            <AdminLayout>
                {children}
            </AdminLayout>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <SignIn fallbackRedirectUrl="/admin" routing="hash"/>
        </div>
    );
}
