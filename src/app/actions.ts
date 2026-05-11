"use server";
import { redirect } from 'next/navigation';

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { login as setSessionLogin, logout as setSessionLogout, getSession } from "@/src/lib/auth";

export async function logoutUser(formData?: FormData) {
  await setSessionLogout();
  redirect("/");
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) throw new Error("Missing fields");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Make first user admin for testing
  const count = await prisma.user.count();
  const role = count === 0 ? "admin" : "customer";

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, role },
  });

  await setSessionLogin(user);
  
  revalidatePath("/");
  return { success: true };
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) throw new Error("Missing fields");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  await setSessionLogin(user);

  revalidatePath("/");
  return { success: true, role: user.role };
}

export async function updateUserRole(id: string, role: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id },
    data: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Unauthorized");

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function createOrder(formData: FormData) {
  const session = await getSession();
  const productId = formData.get("productId") as string;
  const customerName = formData.get("name") as string;
  const customerPhone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const quantity = parseInt(formData.get("quantity") as string);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");

  const totalAmount = product.price * quantity;

  const order = await prisma.order.create({
    data: {
      userId: session?.id || null,
      customerName,
      customerPhone,
      address,
      totalAmount,
      status: "New Order",
      items: {
        create: {
          productId,
          quantity,
          price: product.price,
        },
      },
    },
  });

  // Update stock
  await prisma.product.update({
    where: { id: productId },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/admin");

  return { success: true, orderId: order.id };
}

import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function saveImageLocally(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "assets");
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (e) {
    // Directory might exist
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filepath = path.join(uploadsDir, filename);

  await writeFile(filepath, buffer);
  return `/assets/${filename}`;
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const imageFile = formData.get("imageFile") as File | null;
  const stock = parseInt(formData.get("stock") as string);

  let imageUrl = image;
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveImageLocally(imageFile);
    if (uploadedPath) {
      imageUrl = uploadedPath;
    }
  }

  if (!name || !description || isNaN(price) || !category || !imageUrl || isNaN(stock)) {
    throw new Error("Invalid input");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      category,
      image: imageUrl,
      stock,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/products`);
  revalidatePath(`/product/${id}`);

  return { success: true };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  return { success: true };
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const imageFile = formData.get("imageFile") as File | null;
  const stock = parseInt(formData.get("stock") as string);

  let imageUrl = image;
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveImageLocally(imageFile);
    if (uploadedPath) {
      imageUrl = uploadedPath;
    }
  }

  if (!name || !description || isNaN(price) || !category || !imageUrl || isNaN(stock)) {
    throw new Error("Invalid input");
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      image: imageUrl,
      stock,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true, productId: product.id };
}

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return { success: true };
}

export async function deleteOrder(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Unauthorized");

  // First delete order items if they exist
  await prisma.orderItem.deleteMany({
    where: { orderId: id },
  });
  
  await prisma.order.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return { success: true };
}