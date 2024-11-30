const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config(); // Optional if you choose to use .env

// Encryption settings (remove .env if you're not using it)
const ENCRYPTION_KEY = '01234567890123456789012345678901'; // directly use the key here
const ALGORITHM = 'aes-256-cbc'; // Encryption algorithm
const IV_LENGTH = 16; // Initialization vector length for AES

// Helper functions to encrypt and decrypt data
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Store IV and encrypted data together
}

function decrypt(text) {
  if (!isValidEncryptedText(text)) {
    return text; // If it's not encrypted, return the original text
  }

  const textParts = text.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = textParts[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Function to check if the string is a valid encrypted format
function isValidEncryptedText(text) {
  return text && text.includes(':'); // Valid encrypted text should contain a colon separating IV and encrypted text
}

// Define the schema
const instagramPostSchema = new mongoose.Schema({
  postUrl: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String, // Category related to the post (e.g., lifestyle, fitness, etc.)
  },
  user: {
    type: String, // Manually entered username of the person who posted
  },
  aboutIt: {
    type: String, // Description about the post
    required: true
  }
});

// Middleware to handle encryption before saving to DB
instagramPostSchema.pre('save', function (next) {
  if (this.isModified('postUrl')) {
    this.postUrl = encrypt(this.postUrl); // Encrypt postUrl
  }
  if (this.isModified('category')) {
    this.category = encrypt(this.category); // Encrypt category
  }
  if (this.isModified('user')) {
    this.user = encrypt(this.user); // Encrypt user
  }
  if (this.isModified('aboutIt')) {
    this.aboutIt = encrypt(this.aboutIt); // Encrypt aboutIt
  }
  next();
});

// Middleware to decrypt data when it's read from DB
instagramPostSchema.post('find', function(docs) {
  if (docs) {
    docs.forEach(doc => {
      doc.postUrl = decrypt(doc.postUrl); // Decrypt postUrl
      doc.category = decrypt(doc.category); // Decrypt category
      doc.user = decrypt(doc.user); // Decrypt user
      doc.aboutIt = decrypt(doc.aboutIt); // Decrypt aboutIt
    });
  }
});

instagramPostSchema.post('findOne', function(doc) {
  if (doc) {
    doc.postUrl = decrypt(doc.postUrl); // Decrypt postUrl
    doc.category = decrypt(doc.category); // Decrypt category
    doc.user = decrypt(doc.user); // Decrypt user
    doc.aboutIt = decrypt(doc.aboutIt); // Decrypt aboutIt
  }
});

// Model creation
const InstagramPost = mongoose.model('InstagramPost', instagramPostSchema);

module.exports = InstagramPost;
