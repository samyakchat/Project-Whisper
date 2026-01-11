const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// JWT Secret 
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Simple auth: hardcoded for demo (use DB in production)
  if (username === 'allied' && password === 'command') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Operation Athena Backend is running securely.' });
});

const CryptoJS = require('crypto-js');

// Encryption methods (same as frontend for consistency)
const encryptionMethods = {
  encA: {
    encrypt: (msg) => msg.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join(''),
    decrypt: (msg) => msg.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
  },
  encB: {
    encrypt: (msg) => msg.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + 3) % 26) + 65);
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + 3) % 26) + 97);
      return char;
    }).join(''),
    decrypt: (msg) => msg.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 - 3 + 26) % 26) + 65);
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 - 3 + 26) % 26) + 97);
      return char;
    }).join('')
  },
  encC: {
    encrypt: (msg) => msg.split('').reverse().join(''),
    decrypt: (msg) => msg.split('').reverse().join('')
  },
  encD: {
    encrypt: (msg) => {
      const key = CryptoJS.enc.Utf8.parse('mySecretKey123456789012345678901234'); // 32 bytes for AES-256
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(msg, key, { iv: iv });
      return iv.toString() + ':' + encrypted.toString();
    },
    decrypt: (msg) => {
      try {
        const key = CryptoJS.enc.Utf8.parse('mySecretKey123456789012345678901234');
        const parts = msg.split(':');
        const iv = CryptoJS.enc.Hex.parse(parts[0]);
        const encrypted = parts[1];
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        return 'ERROR: Invalid AES format';
      }
    }
  },
  encE: {
    encrypt: (msg) => {
      let result = msg;
      // Word substitutions
      const wordSubs = {
        'the': 'zhe', 'and': 'xnd', 'for': 'f0r', 'are': 'xre', 'but': 'b7t',
        'not': 'n0t', 'you': 'y0u', 'all': 'xll', 'can': 'c4n', 'had': 'hxd',
        'her': 'h3r', 'was': 'w4s', 'one': '0ne', 'our': '0ur', 'out': '0ut',
        'day': 'd4y', 'get': 'g3t', 'has': 'h4s', 'him': 'h1m', 'his': 'h1s',
        'how': 'h0w', 'its': '1ts', 'may': 'm4y', 'new': 'n3w', 'now': 'n0w',
        'old': '0ld', 'see': 's3e', 'two': 't2o', 'way': 'w4y', 'who': 'wh0',
        'boy': 'b0y', 'did': 'd1d', 'has': 'h4s', 'let': 'l3t', 'put': 'p7t',
        'say': 's4y', 'she': 'sh3', 'too': 't00', 'use': 'us3'
      };
      for (const [word, sub] of Object.entries(wordSubs)) {
        result = result.replace(new RegExp(word, 'gi'), sub);
      }
      // Character substitutions for remaining letters
      result = result.replace(/[aeiou]/gi, (match) => {
        const subs = { 'a': '@', 'e': '3', 'i': '1', 'o': '0', 'u': 'ü' };
        return subs[match.toLowerCase()] || match;
      });
      return result;
    },
    decrypt: (msg) => {
      let result = msg;
      // Reverse character substitutions
      result = result.replace(/[@3ü01]/g, (match) => {
        const revSubs = { '@': 'a', '3': 'e', 'ü': 'u', '0': 'o', '1': 'i' };
        return revSubs[match] || match;
      });
      // Reverse word substitutions
      const wordSubs = {
        'zhe': 'the', 'xnd': 'and', 'f0r': 'for', 'xre': 'are', 'b7t': 'but',
        'n0t': 'not', 'y0u': 'you', 'xll': 'all', 'c4n': 'can', 'hxd': 'had',
        'h3r': 'her', 'w4s': 'was', '0ne': 'one', '0ur': 'our', '0ut': 'out',
        'd4y': 'day', 'g3t': 'get', 'h4s': 'has', 'h1m': 'him', 'h1s': 'his',
        'h0w': 'how', '1ts': 'its', 'm4y': 'may', 'n3w': 'new', 'n0w': 'now',
        '0ld': 'old', 's3e': 'see', 't2o': 'two', 'w4y': 'way', 'wh0': 'who',
        'b0y': 'boy', 'd1d': 'did', 'h4s': 'has', 'l3t': 'let', 'p7t': 'put',
        's4y': 'say', 'sh3': 'she', 't00': 'too', 'us3': 'use'
      };
      for (const [sub, word] of Object.entries(wordSubs)) {
        result = result.replace(new RegExp(sub, 'gi'), word);
      }
      return result;
    }
  },
  encF: {
    encrypt: (msg) => Buffer.from(msg).toString('base64'),
    decrypt: (msg) => {
      try {
        return Buffer.from(msg, 'base64').toString('utf-8');
      } catch (e) {
        return 'ERROR: Invalid base64 format';
      }
    }
  }
};

// Enigma simulation
const enigmaPattern = /^[A-Z]{3} \d{4} [A-Z]{5} \d{2}\s/gi;
const enigmaDecoded = "Our forces have intercepted a supply convoy near the channel.";

function isEnigma(message) {
  return enigmaPattern.test(message);
}

app.post('/encrypt', authenticateToken, (req, res) => {
  const { message, method } = req.body;
  if (!message || !method) {
    return res.status(400).json({ error: 'Message and method required' });
  }
  if (!encryptionMethods[method]) {
    return res.status(400).json({ error: 'Invalid encryption method' });
  }
  const encrypted = encryptionMethods[method].encrypt(message);
  const taggedMessage = `${method}_${encrypted}`;
  res.json({ encrypted: taggedMessage });
});

app.post('/decrypt', authenticateToken, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  const [method, encodedMsg] = message.split('_');
  if (!encryptionMethods[method]) {
    return res.status(400).json({ error: 'Unknown encryption tag' });
  }
  const decrypted = encryptionMethods[method].decrypt(encodedMsg);
  res.json({ decrypted });
});

app.post('/analyze', authenticateToken, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  const isEnigmaDetected = isEnigma(message);
  // Simple safety check: if message contains sensitive words, flag as unsafe
  const sensitiveWords = ['secret', 'classified', 'enigma'];
  const safe = !sensitiveWords.some(word => message.toLowerCase().includes(word));
  res.json({ isEnigma: isEnigmaDetected, safe });
});

// WebSocket server for real-time messaging
const wss = new WebSocket.Server({ port: 3001 }); // WebSocket on port 3001

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on port 3001`);
});
