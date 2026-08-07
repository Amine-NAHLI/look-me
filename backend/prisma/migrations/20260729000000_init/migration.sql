-- Baseline schema for a new LOOKME PostgreSQL database.
-- Existing databases must be reviewed and marked as applied before using migrate deploy.
CREATE TYPE "Role" AS ENUM ('user', 'admin');
CREATE TYPE "Status" AS ENUM ('active', 'archived');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

CREATE TABLE "User" (
  "id" TEXT NOT NULL, "firstName" VARCHAR(80) NOT NULL, "lastName" VARCHAR(80), "phone" VARCHAR(30),
  "email" VARCHAR(254) NOT NULL, "password" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'user',
  "isActive" BOOLEAN NOT NULL DEFAULT true, "passwordChangedAt" TIMESTAMP(3), "resetPasswordToken" TEXT,
  "resetPasswordExpires" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Category" (
  "id" TEXT NOT NULL, "name" VARCHAR(80) NOT NULL, "slug" TEXT NOT NULL, "image" TEXT,
  "status" "Status" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Product" (
  "id" TEXT NOT NULL, "name" VARCHAR(160) NOT NULL, "slug" TEXT NOT NULL, "description" VARCHAR(5000) NOT NULL,
  "categoryId" TEXT NOT NULL, "price" DOUBLE PRECISION NOT NULL, "compareAtPrice" DOUBLE PRECISION,
  "currency" TEXT NOT NULL DEFAULT 'MAD', "images" TEXT[], "brand" VARCHAR(80) NOT NULL DEFAULT 'LOOKME',
  "sku" TEXT, "stock" INTEGER NOT NULL DEFAULT 0, "status" "Status" NOT NULL DEFAULT 'active',
  "featured" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProductVariant" (
  "id" TEXT NOT NULL, "productId" TEXT NOT NULL, "sku" VARCHAR(80), "size" VARCHAR(40), "color" VARCHAR(40),
  "image" TEXT, "stock" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Order" (
  "id" TEXT NOT NULL, "orderNumber" TEXT NOT NULL, "userId" TEXT, "guestAccessTokenHash" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'MAD', "subtotal" DOUBLE PRECISION NOT NULL, "discountTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "deliveryFee" DOUBLE PRECISION NOT NULL, "taxTotal" DOUBLE PRECISION NOT NULL DEFAULT 0, "total" DOUBLE PRECISION NOT NULL,
  "shippingFullName" TEXT NOT NULL, "shippingPhone" TEXT NOT NULL, "shippingAddressLine1" TEXT NOT NULL,
  "shippingCity" TEXT NOT NULL, "shippingPostalCode" TEXT, "billingFullName" TEXT, "billingPhone" TEXT,
  "billingAddressLine1" TEXT, "billingCity" TEXT, "billingPostalCode" TEXT, "shippingMethod" TEXT NOT NULL DEFAULT 'standard',
  "paymentMethod" TEXT NOT NULL DEFAULT 'cash_on_delivery', "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
  "status" "OrderStatus" NOT NULL DEFAULT 'pending', "idempotencyKey" TEXT NOT NULL, "calculationVersion" INTEGER NOT NULL DEFAULT 1,
  "trackingNumber" TEXT, "notes" VARCHAR(1000), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "productId" TEXT NOT NULL, "variantId" TEXT,
  "name" TEXT NOT NULL, "slug" TEXT, "image" TEXT, "sku" TEXT, "size" TEXT, "color" TEXT,
  "unitPrice" DOUBLE PRECISION NOT NULL, "discount" DOUBLE PRECISION NOT NULL DEFAULT 0, "quantity" INTEGER NOT NULL,
  "lineTotal" DOUBLE PRECISION NOT NULL, "currency" TEXT NOT NULL, CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OrderStatusHistory" (
  "id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "status" TEXT NOT NULL, "note" TEXT, "changedById" TEXT,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "RefreshSession" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3), "userAgent" VARCHAR(512), "ip" VARCHAR(64), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL, "actorId" TEXT NOT NULL, "action" VARCHAR(100) NOT NULL, "resourceType" VARCHAR(60) NOT NULL,
  "resourceId" VARCHAR(80) NOT NULL, "metadata" JSONB NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_status_idx" ON "Category"("status");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_categoryId_status_idx" ON "Product"("categoryId", "status");
CREATE INDEX "Product_status_featured_idx" ON "Product"("status", "featured");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "Order_paymentStatus_createdAt_idx" ON "Order"("paymentStatus", "createdAt");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "OrderStatusHistory_orderId_changedAt_idx" ON "OrderStatusHistory"("orderId", "changedAt");
CREATE UNIQUE INDEX "RefreshSession_tokenHash_key" ON "RefreshSession"("tokenHash");
CREATE INDEX "RefreshSession_userId_expiresAt_idx" ON "RefreshSession"("userId", "expiresAt");
CREATE INDEX "AuditLog_resourceType_resourceId_createdAt_idx" ON "AuditLog"("resourceType", "resourceId", "createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
