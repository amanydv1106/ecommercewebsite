# NexKart

[Live Demo](https://nexkartt.vercel.app/)

NexKart is a full-stack multi-vendor ecommerce marketplace that brings together customer shopping, seller operations, and admin-level platform management in one product. It is designed to reflect a real business workflow, where multiple sellers can manage stores and products, customers can browse and purchase items, and administrators can control approvals, stores, and promotions across the marketplace.

## Overview

The platform is built around three connected experiences:

- customer-facing ecommerce journey
- seller dashboard for store and catalog management
- admin panel for marketplace governance

This makes NexKart more than a simple shopping website. It demonstrates how a modern marketplace product can support multiple roles, operational workflows, and business logic inside one application.

## Core Features

- Multi-vendor ecommerce marketplace
- Customer product browsing and shopping flow
- Product detail pages and seller storefront pages
- Cart management and order history
- Seller onboarding and store creation
- Seller product upload and inventory management
- Seller order tracking dashboard
- Admin approval workflow for stores
- Admin coupon management and store monitoring
- Stripe payment integration and Cash on Delivery support
- AI-assisted product listing suggestions from uploaded product images
- Event-driven background workflows for marketplace operations

## AI Feature For Product Title And Description

NexKart includes an AI-assisted listing workflow on the seller route `/store/add-product`.

When a seller uploads a product image, the platform can analyze that image and generate smart suggestions for the product title and description. The seller can request title suggestions or description suggestions separately, review the generated options, and apply the most suitable one directly to the form.

This feature improves listing quality, reduces manual effort, and helps sellers create clearer and more professional product entries faster.

## Technologies Used

NexKart uses a modern full-stack web stack:

- `Next.js` for full-stack application architecture and routing
- `React` for UI development
- `TypeScript` for type-safe and maintainable code
- `Bun` for project tooling and package management
- `Prisma` for database modeling and ORM operations
- `PostgreSQL` as the database layer
- `Clerk` for authentication and user management
- `Stripe` for online payment processing
- `ImageKit` for image upload and media delivery
- `Inngest` for background jobs and event-driven workflows
- `Redux Toolkit` for client-side state management
- `Tailwind CSS` for styling and responsive UI development
- `OpenAI-compatible / Gemini-style vision API integration` for AI-generated product title and description suggestions

## User Roles

### Customer

Customers can explore products, open product detail pages, browse seller storefronts, add products to cart, place orders, and review order history.

### Seller

Sellers can create their own store, add products, upload images, use AI suggestions for product titles and descriptions, manage inventory, and track incoming orders.

### Admin

Admins can approve stores, manage marketplace stores, monitor platform activity, and create promotional coupons.

## Main Routes

### Public Routes

- `/`
  Main landing page and storefront entry.

- `/shop`
  Marketplace browsing page for discovering products.

- `/product/[productId]`
  Dynamic product details page for viewing pricing, content, and purchase options.

- `/shop/[username]`
  Public seller storefront showing products from an individual store.

- `/cart`
  Cart page for reviewing selected products before checkout.

- `/orders`
  Customer order history and tracking page.

- `/pricing`
  Pricing-related page used in the platform business flow.

- `/create-store`
  Store creation and seller onboarding page.

### Seller Routes

- `/store`
  Seller dashboard overview.

- `/store/add-product`
  Product creation page with image upload and AI-assisted product title and description suggestions.

- `/store/manage-product`
  Seller product management page.

- `/store/orders`
  Seller order tracking and management page.

### Admin Routes

- `/admin`
  Main admin dashboard.

- `/admin/approve`
  Store approval workflow page.

- `/admin/stores`
  Platform store management page.

- `/admin/coupons`
  Coupon management page.

## Business Value

NexKart demonstrates how a digital marketplace can be engineered to support real business roles and processes in one system. Instead of focusing only on storefront visuals, the project includes buyer activity, seller productivity tools, and admin controls that are essential in a scalable ecommerce platform.

This makes the project a strong showcase of:

- full-stack product engineering
- marketplace architecture
- role-based workflow design
- third-party service integration
- practical AI usage inside a real business feature

## Highlights

- Clear separation of customer, seller, and admin responsibilities
- Real marketplace structure instead of a single-vendor store
- Integration of payments, authentication, media management, and AI
- Strong product-oriented workflow design
- Practical seller productivity enhancement through AI listing suggestions

## Live Project

Explore the deployed website here:

[https://nexkartt.vercel.app/](https://nexkartt.vercel.app/)
