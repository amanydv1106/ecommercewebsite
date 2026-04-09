import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId?: string | null) => {
    try{
        if(!userId) return false

        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const adminEmails = process.env.ADMIN_EMAIL?.split(',').map((email) => email.trim()).filter(Boolean) ?? []
        return adminEmails.includes(user.emailAddresses[0]?.emailAddress ?? '')
        
    } catch (error) {
        console.error(error)
        return false
    }
}

export default authAdmin
