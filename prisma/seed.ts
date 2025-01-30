import prisma from "../libs/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


async function main() {
    console.log("Seeding default settings...");

    // ✅ Default System Settings
    const adminUser = {
        email: process.env.ADMIN_EMAIL as string,
        name: process.env.ADMIN_NAME as string,
        role: "ADMIN",
        password: await bcrypt.hashSync(process.env.ADMIN_PASSWORD as string, 10),
    }
    
    const user = await prisma.user.create({
        data: adminUser
    });

    console.log("Admin user created successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });