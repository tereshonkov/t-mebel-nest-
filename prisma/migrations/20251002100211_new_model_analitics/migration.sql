-- CreateTable
CREATE TABLE "public"."visitor" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "visits" INTEGER NOT NULL,
    "called" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page_visit" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."call_click" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_ip_key" ON "public"."visitor"("ip");

-- AddForeignKey
ALTER TABLE "public"."page_visit" ADD CONSTRAINT "page_visit_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."call_click" ADD CONSTRAINT "call_click_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
