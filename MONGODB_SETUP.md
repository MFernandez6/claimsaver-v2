# MongoDB Atlas Setup Guide for Production

## Issue: IP Whitelist Error

The error you're seeing indicates that MongoDB Atlas is rejecting connections because your deployment IP address isn't whitelisted. This is a security feature of MongoDB Atlas.

## Solution Options

### Option 1: Whitelist All IPs (Quick Fix - Less Secure)

1. **Log into MongoDB Atlas** (https://cloud.mongodb.com)
2. **Navigate to your cluster**
3. **Click on "Network Access" in the left sidebar**
4. **Click "Add IP Address"**
5. **Click "Allow Access from Anywhere"** (this adds `0.0.0.0/0`)
6. **Click "Confirm"**

⚠️ **Warning**: This allows connections from any IP address, which is less secure but easier for development.

### Option 2: Whitelist Specific IP Ranges (More Secure)

#### For Vercel Deployment:

1. **Get your Vercel IP ranges**:

   - Go to https://vercel.com/docs/concepts/edge-network/regions
   - Find your deployment region
   - Use the IP ranges listed for that region

2. **Add IP ranges to MongoDB Atlas**:
   - Log into MongoDB Atlas
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Add IP Address"
   - Enter the IP ranges (e.g., `76.76.19.0/24` for Vercel)
   - Click "Confirm"

#### For Other Platforms:

- **Netlify**: Use `75.2.60.5/32` and `99.83.190.102/32`
- **Railway**: Use `76.76.19.0/24`
- **Render**: Use `76.76.19.0/24`

### Option 3: Use MongoDB Atlas Data API (Most Secure)

This approach doesn't require IP whitelisting:

1. **Enable Data API in MongoDB Atlas**:

   - Go to your cluster
   - Click "Data API" in the left sidebar
   - Click "Enable Data API"
   - Create an API key

2. **Update your environment variables**:

   ```env
   MONGODB_DATA_API_URL=https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1
   MONGODB_DATA_API_KEY=your_api_key_here
   ```

3. **Update your connection code** (if implementing this option)

## Environment Variables Check

Make sure your production environment has the correct MongoDB URI:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Testing the Connection

After making changes:

1. **Redeploy your application**
2. **Try uploading a document**
3. **Check the console logs for connection success**

## Common Issues and Solutions

### Issue: Still getting whitelist error after adding IP

- **Solution**: Wait 1-2 minutes for changes to propagate
- **Solution**: Check if you're using the correct IP range

### Issue: Authentication failed

- **Solution**: Verify your MongoDB username and password
- **Solution**: Check if your user has the correct permissions

### Issue: Connection timeout

- **Solution**: Check your internet connection
- **Solution**: Verify the MongoDB URI is correct

## Security Best Practices

1. **Use specific IP ranges** instead of `0.0.0.0/0` when possible
2. **Regularly review and update** your IP whitelist
3. **Use strong passwords** for your MongoDB users
4. **Enable MongoDB Atlas security features** like:
   - Database access controls
   - Network access controls
   - Audit logging

## Monitoring

After fixing the issue, monitor your MongoDB Atlas dashboard for:

- Connection attempts
- Query performance
- Error rates
- Storage usage

## Support

If you continue to have issues:

1. Check MongoDB Atlas logs
2. Review your deployment platform's documentation
3. Contact MongoDB Atlas support
4. Check your application logs for detailed error messages
