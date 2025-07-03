import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../server';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback' // Calls once user successfully logs in via Google
}, async (accessToken, refreshToken, profile, done) => {
    // Grabs the first email from the Google profile.
    const email = profile.emails?.[0].value;

    if (!email) {
        return done(new Error("Google profile did not return an email"));
    }

    // If a user with that email already exists, existing will be that user.
    const existing = await prisma.user.findUnique({ where: { email } })

    const user = existing ?? await prisma.user.create({
        data: { email, password: '', oauthProvider: 'google' }
    });

    return done(null, user);
}));

// Saves user ID to the session
passport.serializeUser((user: any, done) => done(null, user.id));

// Fetches full user details from the DB on future requests using that ID.
passport.deserializeUser(async (id: string, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user)
});