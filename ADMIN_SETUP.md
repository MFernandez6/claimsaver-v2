# Admin Dashboard Setup Guide

## Overview

The ClaimSaver+ admin dashboard provides comprehensive tools for managing user claims, user accounts, and system analytics. This guide will help you set up and configure the admin functionality.

## Features

### Admin Dashboard (`/admin`)

- **Overview Tab**: Real-time statistics and quick actions
- **Claims Management**: View, search, filter, and manage all claims
- **User Management**: Manage user accounts and permissions
- **Analytics**: System performance metrics and insights

### Claim Detail Pages (`/admin/claims/[id]`)

- **Comprehensive Claim View**: All claim information in one place
- **Edit Functionality**: Update claim status, priority, and details
- **Notes System**: Add and track internal notes
- **Document Management**: View and manage associated documents

## Database Models

### Claim Model

```typescript
{
  userId: string;
  claimNumber: string; // Auto-generated: CS2412-0001
  status: "pending" |
    "reviewing" |
    "approved" |
    "rejected" |
    "in_progress" |
    "completed";
  priority: "low" | "medium" | "high" | "urgent";
  // Personal Information
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantAddress: object;
  // Accident Details
  accidentDate: Date;
  accidentLocation: string;
  accidentDescription: string;
  // Insurance Information
  insuranceCompany: string;
  policyNumber: string;
  // Vehicle Information
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  // Financial Information
  estimatedValue: number;
  settlementAmount: number;
  // Admin Fields
  assignedTo: string;
  notes: Array<{ content: string; author: string; timestamp: Date }>;
  documents: Array<Document>;
}
```

### User Model

```typescript
{
  clerkId: string; // Clerk user ID
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  // Admin Permissions
  adminPermissions: {
    canViewClaims: boolean;
    canEditClaims: boolean;
    canDeleteClaims: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
  }
  // Statistics
  stats: {
    totalClaims: number;
    activeClaims: number;
    completedClaims: number;
    totalSettlements: number;
  }
}
```

## API Endpoints

### Claims Management

- `GET /api/admin/claims` - Fetch claims with filtering and pagination
- `POST /api/admin/claims` - Create new claim
- `PUT /api/admin/claims/[id]` - Update claim (to be implemented)
- `DELETE /api/admin/claims/[id]` - Delete claim (to be implemented)

### User Management

- `GET /api/admin/users` - Fetch users with filtering and pagination
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user (to be implemented)
- `DELETE /api/admin/users/[id]` - Delete user (to be implemented)

## Environment Variables

Add these to your `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/claimsaver
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/claimsaver

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Setup Instructions

### 1. Database Setup

1. Install MongoDB locally or set up MongoDB Atlas
2. Add your MongoDB connection string to `.env.local`
3. The models will be automatically created when first used

### 2. Admin Role Assignment

Currently, the admin link is shown to all signed-in users for demonstration. To implement proper role-based access:

1. Create a user in your database with admin role
2. Update the `AdminLink` component in `src/components/navbar.tsx` to check user roles
3. Implement role checking in API routes

### 3. Admin User Creation

To create your first admin user:

1. Sign up through the regular user flow
2. Manually update the user's role in the database to "admin"
3. Or implement an admin creation endpoint

## Security Considerations

### Authentication

- All admin routes require Clerk authentication
- Implement proper role-based access control
- Add middleware to check admin permissions

### Data Protection

- Validate all input data
- Implement rate limiting on API endpoints
- Use HTTPS in production
- Regular security audits

### Access Control

- Implement session management
- Add audit logs for admin actions
- Regular permission reviews

## Customization

### Adding New Fields

1. Update the model schemas in `src/models/`
2. Update the admin interface components
3. Add validation and error handling

### Custom Workflows

1. Create new API endpoints for custom actions
2. Add UI components for workflow management
3. Implement notification systems

### Reporting

1. Add analytics endpoints
2. Create custom dashboard widgets
3. Implement export functionality

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Check MongoDB connection string
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Authentication Issues**

   - Verify Clerk configuration
   - Check environment variables
   - Clear browser cache

3. **Permission Errors**
   - Check user role in database
   - Verify admin permissions
   - Review API route protection

### Debug Mode

Enable debug logging by adding to `.env.local`:

```env
DEBUG=true
```

## Future Enhancements

### Planned Features

- [ ] Advanced analytics and reporting
- [ ] Bulk operations for claims
- [ ] Email notifications
- [ ] Document upload and management
- [ ] Mobile admin app
- [ ] API rate limiting
- [ ] Audit trail system
- [ ] Custom workflow builder

### Integration Opportunities

- [ ] Payment processing
- [ ] Insurance company APIs
- [ ] Legal document generation
- [ ] SMS notifications
- [ ] Third-party analytics

## Support

For technical support or questions about the admin dashboard:

1. Check the documentation
2. Review the code comments
3. Create an issue in the repository
4. Contact the development team

## License

This admin dashboard is part of the ClaimSaver+ application and follows the same licensing terms.
