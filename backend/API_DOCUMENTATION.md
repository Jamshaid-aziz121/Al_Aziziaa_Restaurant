# API Documentation - Aziz Restaurant Platform

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
Most endpoints require authentication. Include an Authorization header with a valid JWT token:
```
Authorization: Bearer <token>
```

## Common Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

For errors:
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "errorId": "ERR_123456789"
}
```

## Endpoints

### Reservations

#### POST /api/reservations
Create a new reservation

**Request Body:**
```json
{
  "customerId": "string",
  "reservationDate": "YYYY-MM-DD",
  "reservationTime": "HH:MM",
  "partySize": "integer",
  "specialRequests": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reservation-id",
    "customerId": "customer-id",
    "reservationDate": "2023-12-25T00:00:00.000Z",
    "reservationTime": "18:00",
    "partySize": 4,
    "status": "CONFIRMED",
    "confirmationCode": "RES-123456789",
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### GET /api/reservations/:id
Get a reservation by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reservation-id",
    "customerId": "customer-id",
    "reservationDate": "2023-12-25T00:00:00.000Z",
    "reservationTime": "18:00",
    "partySize": 4,
    "status": "CONFIRMED",
    "confirmationCode": "RES-123456789",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "customer": {
      "id": "customer-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
}
```

#### GET /api/reservations/customer/:customerId
Get all reservations for a customer

#### PUT /api/reservations/:id
Update a reservation

#### PATCH /api/reservations/:id/cancel
Cancel a reservation

#### GET /api/reservations/availability/check
Check availability for a date, time, and party size

**Query Parameters:**
- date: YYYY-MM-DD
- time: HH:MM
- partySize: integer

#### GET /api/reservations/availability/slots
Get available time slots for a date and party size

**Query Parameters:**
- date: YYYY-MM-DD
- partySize: integer

### Menu

#### GET /api/menu
Get all menu items

#### GET /api/menu/:id
Get a specific menu item

#### POST /api/menu/search
Search menu items

**Request Body:**
```json
{
  "query": "search term",
  "category": "category",
  "dietaryRestrictions": ["vegetarian", "gluten-free"]
}
```

### Orders

#### POST /api/orders
Create a new order

**Request Body:**
```json
{
  "customerId": "string",
  "orderType": "DELIVERY | PICKUP",
  "items": [
    {
      "menuItemId": "string",
      "quantity": "integer",
      "unitPrice": "float",
      "specialInstructions": "string"
    }
  ],
  "deliveryAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "specialInstructions": "string"
}
```

#### GET /api/orders/:id
Get an order by ID

#### GET /api/orders/tracking/:trackingId
Get an order by tracking ID

#### GET /api/orders/customer/:customerId
Get all orders for a customer

#### PUT /api/orders/:id
Update an order

#### PUT /api/orders/:id/status
Update order status

### Status Tracking

#### GET /api/status/orders/:orderId/history
Get order status history

#### GET /api/status/orders/:orderId/current
Get current order status

#### GET /api/status/orders/tracking/:trackingId
Get order status by tracking ID

#### PUT /api/status/orders/:orderId/status
Update order status

**Request Body:**
```json
{
  "status": "RECEIVED | PREPARING | READY | OUT_FOR_DELIVERY | READY_FOR_PICKUP | COMPLETED | CANCELLED",
  "updatedBy": "string",
  "notes": "string"
}
```

### Dashboard

#### GET /api/dashboard/customer/:customerId
Get customer dashboard data (reservations and orders)

#### GET /api/dashboard/my-dashboard
Get authenticated customer's dashboard data

#### GET /api/dashboard/customer/:customerId/upcoming
Get upcoming reservations and orders

### Admin

#### GET /api/admin/dashboard
Get admin dashboard statistics

#### GET /api/admin/reservations
Get all reservations (admin only)

#### GET /api/admin/orders
Get all orders (admin only)

#### PUT /api/admin/orders/:orderId/status
Update order status (admin only)

## Error Codes

- 400: Bad Request - Invalid input data
- 401: Unauthorized - Invalid or missing authentication token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource does not exist
- 409: Conflict - Resource already exists
- 500: Internal Server Error - Something went wrong on the server

## Rate Limits

- Global: 100 requests per 15 minutes per IP
- API endpoints: 50 requests per 15 minutes per IP
- Authentication endpoints: 5 attempts per 15 minutes per IP