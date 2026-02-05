# Data Model: Advanced Restaurant Platform Features

## Overview
This document defines the data structures and relationships for the restaurant platform features, including reservations, menu items, orders, and order tracking.

## Core Entities

### 1. Customer
Represents a restaurant customer who can make reservations and place orders.

**Fields:**
- `id` (UUID) - Unique identifier
- `email` (String, unique, required) - Customer's email address
- `firstName` (String, required) - Customer's first name
- `lastName` (String, required) - Customer's last name
- `phone` (String) - Customer's phone number
- `address` (Object) - Customer's address with street, city, state, zip
- `createdAt` (DateTime) - Timestamp of account creation
- `updatedAt` (DateTime) - Timestamp of last update
- `preferences` (JSON) - Customer's dietary preferences and allergies

**Validation Rules:**
- Email must be valid format
- Phone number must be valid format if provided
- At least firstName and lastName required

**Relationships:**
- One-to-many with Reservations
- One-to-many with Orders

### 2. MenuItem
Represents a food or drink item on the restaurant menu.

**Fields:**
- `id` (UUID) - Unique identifier
- `name` (String, required) - Name of the menu item
- `description` (Text) - Detailed description of the item
- `price` (Decimal, required) - Price of the item
- `category` (String, required) - Category (appetizer, entree, dessert, etc.)
- `dietaryIndicators` (Array<String>) - Dietary tags (vegan, vegetarian, gluten-free, halal, etc.)
- `available` (Boolean, default: true) - Whether the item is currently available
- `featured` (Boolean, default: false) - Whether the item is featured
- `seasonal` (Boolean, default: false) - Whether the item is seasonal
- `seasonStart` (Date) - Start date for seasonal availability
- `seasonEnd` (Date) - End date for seasonal availability
- `imagePath` (String) - Path to the item's image
- `calories` (Integer) - Calorie count if available
- `createdAt` (DateTime) - Timestamp of menu item creation
- `updatedAt` (DateTime) - Timestamp of last update

**Validation Rules:**
- Price must be positive
- Category must be from predefined list
- Dietary indicators must be from predefined list
- Season dates must be valid if seasonal is true

**Relationships:**
- Many-to-many with Orders (through OrderItem)

### 3. Reservation
Represents a table reservation made by a customer.

**Fields:**
- `id` (UUID) - Unique identifier
- `customerId` (UUID, foreign key) - Reference to the customer
- `reservationDate` (Date, required) - Date of the reservation
- `reservationTime` (Time, required) - Time of the reservation
- `partySize` (Integer, required) - Number of people in the party
- `specialRequests` (Text) - Special requests from the customer
- `status` (Enum, required) - Status (confirmed, pending, cancelled)
- `tableNumber` (String) - Assigned table number
- `durationMinutes` (Integer, default: 90) - Expected duration of the reservation
- `createdAt` (DateTime) - Timestamp of reservation creation
- `updatedAt` (DateTime) - Timestamp of last update
- `confirmationCode` (String, unique) - Unique confirmation code

**Validation Rules:**
- Party size must be between 1 and maximum allowed
- Reservation time must be within restaurant hours
- Status must be from predefined enum values
- Date must be in the future

**Relationships:**
- Many-to-one with Customer
- Many-to-one with Employee (who created the reservation, optional)

### 4. Order
Represents a customer's food order.

**Fields:**
- `id` (UUID) - Unique identifier
- `customerId` (UUID, foreign key) - Reference to the customer
- `orderType` (Enum, required) - Type (delivery, pickup)
- `status` (Enum, required) - Current status (received, preparing, ready, out-for-delivery, completed, cancelled)
- `totalAmount` (Decimal, required) - Total order amount
- `taxAmount` (Decimal) - Tax amount
- `tipAmount` (Decimal, default: 0) - Tip amount
- `deliveryFee` (Decimal, default: 0) - Delivery fee if applicable
- `paymentStatus` (Enum, required) - Payment status (pending, paid, failed)
- `paymentMethod` (Enum) - Method (credit-card, cash-on-delivery)
- `deliveryAddress` (Object) - Delivery address if applicable
- `pickupTime` (DateTime) - Estimated pickup time
- `deliveryTime` (DateTime) - Estimated delivery time
- `specialInstructions` (Text) - Special instructions from customer
- `createdAt` (DateTime) - Timestamp of order creation
- `updatedAt` (DateTime) - Timestamp of last update
- `trackingId` (String, unique) - Unique tracking identifier

**Validation Rules:**
- Total amount must be positive
- Status must be from predefined enum values
- Payment status must be from predefined enum values
- Delivery address required if order type is delivery

**Relationships:**
- Many-to-one with Customer
- One-to-many with OrderItem
- One-to-many with OrderStatusHistory

### 5. OrderItem
Represents an individual item in an order (junction table for Order and MenuItem).

**Fields:**
- `id` (UUID) - Unique identifier
- `orderId` (UUID, foreign key) - Reference to the order
- `menuItemId` (UUID, foreign key) - Reference to the menu item
- `quantity` (Integer, required) - Quantity of the item
- `unitPrice` (Decimal, required) - Price at time of order
- `specialInstructions` (Text) - Special instructions for this item
- `subtotal` (Decimal, required) - Quantity × unit price

**Validation Rules:**
- Quantity must be positive
- Unit price must match menu item price at time of order
- Subtotal must equal quantity × unit price

**Relationships:**
- Many-to-one with Order
- Many-to-one with MenuItem

### 6. OrderStatusHistory
Tracks the status changes of an order over time.

**Fields:**
- `id` (UUID) - Unique identifier
- `orderId` (UUID, foreign key) - Reference to the order
- `status` (Enum, required) - Status at this point in time
- `timestamp` (DateTime, required) - When status was set
- `notes` (Text) - Optional notes about the status change
- `updatedBy` (String) - Who updated the status (employee ID or system)

**Validation Rules:**
- Status must be from predefined enum values
- Timestamp must be current or past time
- Each order can have multiple status history records

**Relationships:**
- Many-to-one with Order

### 7. Table
Represents a physical table in the restaurant.

**Fields:**
- `id` (UUID) - Unique identifier
- `tableNumber` (String, required, unique) - Table identifier
- `capacity` (Integer, required) - Maximum number of seats
- `location` (String) - Location in the restaurant (indoor, outdoor, window, etc.)
- `available` (Boolean, default: true) - Whether the table is available
- `createdAt` (DateTime) - Timestamp of table creation
- `updatedAt` (DateTime) - Timestamp of last update

**Validation Rules:**
- Capacity must be positive
- Table number must be unique

**Relationships:**
- One-to-many with Reservations (when a table is assigned)

## Enums

### Reservation Status
- `pending` - Reservation awaiting confirmation
- `confirmed` - Confirmed reservation
- `cancelled` - Cancelled reservation
- `no-show` - Customer did not show up
- `completed` - Reservation completed

### Order Status
- `received` - Order received by kitchen
- `preparing` - Order being prepared
- `ready` - Order ready for pickup/delivery
- `out-for-delivery` - Order out for delivery
- `ready-for-pickup` - Order ready for customer pickup
- `completed` - Order completed
- `cancelled` - Order cancelled

### Order Type
- `delivery` - Order for delivery
- `pickup` - Order for pickup
- `dine-in` - Order for dine-in (future expansion)

### Payment Status
- `pending` - Payment pending
- `paid` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

### Payment Method
- `credit-card` - Credit card payment
- `debit-card` - Debit card payment
- `cash-on-delivery` - Cash on delivery
- `digital-wallet` - Digital wallet (PayPal, Apple Pay, etc.)

## Indexes

### Critical Indexes
- `reservations(reservationDate, reservationTime, status)` - For checking availability
- `orders(customerId, createdAt)` - For customer order history
- `orders(trackingId)` - For tracking lookup
- `menu_items(category, available)` - For menu filtering
- `customers(email)` - For customer lookup

### Performance Indexes
- `order_items(orderId)` - For retrieving order details
- `order_status_history(orderId, timestamp)` - For tracking order progress
- `reservations(customerId, createdAt)` - For customer reservation history

## Constraints

### Primary Keys
- All entities use UUID for primary keys to ensure global uniqueness

### Foreign Key Constraints
- Referential integrity enforced with cascading updates where appropriate
- Prevent deletion of referenced entities without explicit action

### Unique Constraints
- Customer email must be unique
- Reservation confirmation code must be unique
- Order tracking ID must be unique
- Table number must be unique

### Check Constraints
- Prices must be positive values
- Quantities must be positive values
- Party sizes must be within restaurant capacity limits

## Business Logic

### Reservation Conflicts
- Prevent double booking of the same table for overlapping times
- Consider reservation duration when checking availability
- Allow buffer time between reservations if configured

### Menu Availability
- Hide seasonal items outside their season dates
- Show unavailable items as "temporarily unavailable"
- Allow admin override for special circumstances

### Order Status Transitions
- Orders can only transition through valid states
- Automatic status updates based on business rules
- Notifications triggered on status changes

### Data Retention
- Soft delete for important historical data
- Configurable retention periods for different data types
- Archival of old data to maintain performance