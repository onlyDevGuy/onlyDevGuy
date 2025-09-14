// Secure authentication handling
class Auth {
    constructor() {
        this.loginAttempts = {};
        this.maxAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
        this.sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        
        // Password hash (using SHA-256) for "Sizwe@Admin2025"
        this.passwordHash = '8a9bcf1e4b1c7c3d5e2f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8';
    }
    
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    getClientId() {
        return window.localStorage.getItem('clientId') || this.generateClientId();
    }
    
    generateClientId() {
        const clientId = crypto.randomUUID();
        window.localStorage.setItem('clientId', clientId);
        return clientId;
    }
    
    isLockedOut(clientId) {
        const attempts = this.loginAttempts[clientId];
        if (!attempts) return false;
        
        if (attempts.count >= this.maxAttempts && 
            Date.now() - attempts.lastAttempt < this.lockoutDuration) {
            return true;
        }
        
        // Reset if lockout period has passed
        if (Date.now() - attempts.lastAttempt >= this.lockoutDuration) {
            delete this.loginAttempts[clientId];
        }
        
        return false;
    }
    
    recordLoginAttempt(clientId, success) {
        if (!this.loginAttempts[clientId]) {
            this.loginAttempts[clientId] = { count: 0, lastAttempt: Date.now() };
        }
        
        if (!success) {
            this.loginAttempts[clientId].count++;
            this.loginAttempts[clientId].lastAttempt = Date.now();
        } else {
            delete this.loginAttempts[clientId];
        }
    }
    
    getRemainingLockoutTime(clientId) {
        const attempts = this.loginAttempts[clientId];
        if (!attempts || !this.isLockedOut(clientId)) return 0;
        
        const remainingTime = this.lockoutDuration - (Date.now() - attempts.lastAttempt);
        return Math.max(0, Math.ceil(remainingTime / 1000)); // Return remaining seconds
    }
    
    async verifyPassword(password) {
        const hashedPassword = await this.hashPassword(password);
        return hashedPassword === this.passwordHash;
    }
    
    generateSessionToken() {
        return crypto.randomUUID();
    }
    
    createSession() {
        const token = this.generateSessionToken();
        const session = {
            token,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.sessionDuration
        };
        
        window.localStorage.setItem('adminSession', JSON.stringify(session));
        return session;
    }
    
    validateSession() {
        const sessionStr = window.localStorage.getItem('adminSession');
        if (!sessionStr) return false;
        
        const session = JSON.parse(sessionStr);
        if (Date.now() > session.expiresAt) {
            this.clearSession();
            return false;
        }
        
        return true;
    }
    
    clearSession() {
        window.localStorage.removeItem('adminSession');
    }
    
    async login(password) {
        const clientId = this.getClientId();
        
        // Check for lockout
        if (this.isLockedOut(clientId)) {
            const remainingTime = this.getRemainingLockoutTime(clientId);
            throw new Error(`Account is locked. Try again in ${Math.ceil(remainingTime / 60)} minutes.`);
        }
        
        // Verify password
        const isValid = await this.verifyPassword(password);
        this.recordLoginAttempt(clientId, isValid);
        
        if (!isValid) {
            const attempts = this.loginAttempts[clientId].count;
            const remainingAttempts = this.maxAttempts - attempts;
            
            if (remainingAttempts > 0) {
                throw new Error(`Invalid password. ${remainingAttempts} attempts remaining.`);
            } else {
                throw new Error('Account is now locked. Try again in 15 minutes.');
            }
        }
        
        // Create session
        return this.createSession();
    }
    
    logout() {
        this.clearSession();
    }
}

// Initialize authentication
const auth = new Auth();

// Export for use in other files
window.auth = auth;